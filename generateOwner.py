import numpy as np
import cv2
import random
import base64
from extractWatermark import extract

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

def generate(master_img,watermark_img):
    inputImage = cv2.imdecode(np.fromstring(base64.b64decode(master_img),np.uint8), cv2.IMREAD_UNCHANGED)
    logoImage = cv2.imdecode(np.fromstring(base64.b64decode(watermark_img),np.uint8), 0)
   
    watermark_img = cv2.resize(logoImage, (64, 64))    
    (thresh, watermark_img) = cv2.threshold(watermark_img, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    master_img = cv2.resize(inputImage, (513, 513)) 

    # extract RGB channel
    blue_channel = master_img[:, :, 0]
    green_channel = master_img[:, :, 1]
    red_channel = master_img[:, :, 2]

    # cv2.imshow("master R", blue_channel)
    # cv2.waitKey(0)
    # cv2.imshow("master G", green_channel)
    # cv2.waitKey(0)
    # cv2.imshow("master B", red_channel)
    # cv2.waitKey(0)

    FWR = generate_fw(red_channel, 64)
    FWG = generate_fw(green_channel, 64)
    FWB = generate_fw(blue_channel, 64)

    key1 = random.randrange(1,100)/100
    l1 = logistic_map(key1, 4, 64)

    key2 = random.randrange(1,100)/100
    l2 = logistic_map(key2, 4, 64)
    
    FWR2 = xor_op(l1, FWR)
    FWG2 = xor_op(l1, FWG)
    FWB2 = xor_op(l1, FWB)
    
    watermark_enc = xor_op(l2, watermark_img)
    zeroR = xor_op(watermark_enc, FWR2)
    zeroG = xor_op(watermark_enc, FWG2)
    zeroB = xor_op(watermark_enc, FWB2)

    # cv2.imshow("ZW R", zeroR)
    # cv2.waitKey(0)
    # cv2.imshow("ZW G", zeroG)
    # cv2.waitKey(0)
    # cv2.imshow("ZW B", zeroB)
    # cv2.waitKey(0)

    encoded_zeroR =  base64.b64encode(cv2.imencode('.jpg', zeroR)[1]).decode()
    encoded_zeroG =  base64.b64encode(cv2.imencode('.jpg', zeroG)[1]).decode()
    encoded_zeroB =  base64.b64encode(cv2.imencode('.jpg', zeroB)[1]).decode()

    return (encoded_zeroR, encoded_zeroG, encoded_zeroB , key1, key2)

    
