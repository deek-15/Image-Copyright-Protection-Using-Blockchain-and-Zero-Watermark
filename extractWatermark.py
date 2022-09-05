import numpy as np
import cv2
import base64

def xor_op (m1, m2) :
  row = m1.shape[0]
  col = m1.shape[1]
  m1 = m1.tolist()
  m2 = m2.tolist()

  result = np.zeros((row, col))
  for i in range(row) :
    for j in range(col) :
      if m1[i][j] == m2[i][j] :
        result[i, j] = 0
      else :
        result[i, j] = 255

  return result


def logistic_map(key, lbda, size):
    seq = []
    for i in range(size ** 2):
        key = lbda * key * (1 - key)
        seq.append(key)

    T = sum(seq) / len(seq)
    bseq = []
    for i in range(len(seq)):
        if seq[i] > T:
            bseq.append(255)
        else:
            bseq.append(0)

    bseq = np.array(bseq).reshape(size, size)
    return bseq

def generate_fw(I, L):
    distance = np.zeros(I.shape)
    L2 = L * L
    N = I.shape[0] // 2
    row = 2 * N + 1
    col = 2 * N + 1
    rmax = N
    wmax = N
    center = N

    for i in range(row):
        for j in range(col):
            distance[i, j] = round(((i - center) ** 2 + (j - center) ** 2) ** 0.5)

    fea = []
    iterations = 0
    w = 0
    # r = 1
    while iterations < L2 and w < wmax:
        r = 1
        while iterations < L2 and r < rmax:
            ss = 0
            num = 0

            position = I[(distance >= r) & (distance <= (r + w))]
            ss = position.sum()
            num = position.shape[0]
            fea.append(ss / num)
            iterations += 1
            r += 1
        w += 1

    T = sum(fea) / len(fea)
    FW = []
    for i in range(len(fea)):
        if fea[i] > T:
            FW.append(255)
        else:
            FW.append(0)

    FW = np.array(FW).reshape(L, L)
    return FW


def extract(attack_img, zeroR, zeroG, zeroB, key1, key2):

    attack_img = cv2.imdecode(np.fromstring(base64.b64decode(attack_img),np.uint8), cv2.IMREAD_UNCHANGED)
    zeroR = cv2.imdecode(np.fromstring(base64.b64decode(zeroR),np.uint8), cv2.IMREAD_UNCHANGED)
    zeroG = cv2.imdecode(np.fromstring(base64.b64decode(zeroG),np.uint8), cv2.IMREAD_UNCHANGED)
    zeroB = cv2.imdecode(np.fromstring(base64.b64decode(zeroB),np.uint8), cv2.IMREAD_UNCHANGED)

    attack_img = cv2.resize(attack_img, (513, 513))

    # extract RGB channel
    a_blue_channel = attack_img[:, :, 0]
    a_green_channel = attack_img[:, :, 1]
    a_red_channel = attack_img[:, :, 2]

    AFWR = generate_fw(a_red_channel, 64)
    AFWG = generate_fw(a_green_channel, 64)
    AFWB = generate_fw(a_blue_channel, 64)

    a_l1 = logistic_map(key1, 4, 64)
    a_l2 = logistic_map(key2, 4, 64)
    
    AFWR2 = xor_op(AFWR, a_l1)
    AFWG2 = xor_op(AFWG, a_l1)
    AFWB2 = xor_op(AFWB, a_l1)

    WATERR = xor_op(zeroR, AFWR2)
    WATERG = xor_op(zeroG, AFWG2)
    WATERB = xor_op(zeroB, AFWB2)

    WATER = np.zeros(WATERR.shape)
    for i in range(WATER.shape[0]):
        for j in range(WATER.shape[1]):
            WATER[i, j] = round((WATERR[i, j] + WATERG[i, j] + WATERB[i, j]) / 3)
    
    WATER = xor_op(WATER, a_l2)

    encodedLogo =  base64.b64encode(cv2.imencode('.jpg', WATER)[1]).decode()

    return encodedLogo

