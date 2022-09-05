pragma experimental ABIEncoderV2;

contract RegisterImages {
    // Struct to store Image data
    struct Image {
        string ipfsHashR;
        string ipfsHashG;
        string ipfsHashB;
        string title;
        string desc;
        uint256 uploadedOn;
        string key1;
        string key2;
    }

    // Mapping to store the image ansd their owner
    mapping(address => Image[]) public ownerToImages;

    event LogImageUploaded(
        address indexed _owner,
        string _ipfsHashR,
        string _ipfsHashG,
        string _ipfsHashB,
        string _title,
        string _description,
        uint256 _uploadedOn
    );

    // Fallback function
    function() external {}

    function uploadImage(
        string memory _ipfsHashR,
        string memory _ipfsHashG,
        string memory _ipfsHashB,
        string memory _title,
        string memory _desc,
        string memory _key1,
        string memory _key2
    ) public payable returns (bool _success) {
        uint256 _uploadedOn = block.timestamp;
        Image memory image = Image(
            _ipfsHashR,
            _ipfsHashG,
            _ipfsHashB,
            _title,
            _desc,
            _uploadedOn,
            _key1,
            _key2
        );
        ownerToImages[msg.sender].push(image);

        emit LogImageUploaded(
            msg.sender,
            _ipfsHashR,
            _ipfsHashG,
            _ipfsHashB,
            _title,
            _desc,
            _uploadedOn
        );
        _success = true;
    }

    function getImageCount() public view returns (uint256) {
        return ownerToImages[msg.sender].length;
    }

    function getImage(uint8 _index) public view returns (Image memory _image) {
        require(_index >= 0 && _index <= 2**8 - 1);
        Image memory image = ownerToImages[msg.sender][_index];
        return (image);
    }
}

// Events need to be created
