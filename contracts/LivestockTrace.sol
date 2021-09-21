// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.7.0;

/**
 * @title UserManager
 * @dev Mengontrol role dari user
 */
contract UserManager {
    address public admin;

    enum Role {
        farmer,
        stocker,
        butcher,
        retailer
    }

    struct User {
        address userAddress;
        string name;
        Role role;
        uint256 timeUpdated;
        uint256 timeCreated;
        bool active;
    }

    mapping(address => User) public users;

    constructor() public {
        admin = msg.sender;
    }

    function registerUser(
        address _address,
        string memory _name,
        uint8 _role
    ) public {
        User storage _user = users[_address];

        require(!_user.active);

        users[_address] = User({
            userAddress: _address,
            name: _name,
            role: Role(_role),
            timeUpdated: block.number,
            timeCreated: block.number,
            active: true
        });
    }

    function getRole(address _address) public view returns (uint8) {
        return uint8(users[_address].role);
    }

    function checkRole() public view returns (uint256) {
        return getRole(msg.sender);
    }

    function checkUser(address _address) public view returns (bool) {
        return users[_address].active;
    }

    function isAdmin(address _address) public view returns (bool) {
        return (_address == admin) ? true : false;
    }

    modifier onlyFarmer() {
        require(getRole(msg.sender) == 0, "not farmer");
        _;
    }

    modifier onlyStocker() {
        require(getRole(msg.sender) == 1, "not stocker");
        _;
    }

    modifier onlyButcher() {
        require(getRole(msg.sender) == 2, "not butcher");
        _;
    }
}

/**
 * @title LivestockManager
 * @dev Mengontrol pembuatan livestock dan distribusi
 */
contract LivestockManager is UserManager {
    struct Cowshed {
        address ownerId;
        //uint256 livestockCount;
        uint256[] lsId;
        uint256 timeUpdated;
        uint256 timeCreated;
        bool status;
    }

    enum State {
        farmer,
        stocker,
        butcher,
        beef
    }
    enum Race {
        bali,
        madura,
        brahman,
        PO,
        brahmanCross,
        ongole,
        aceh
    }

    struct Livestock {
        uint256 farmIndex;
        uint256 lsId;
        uint256 fatherId;
        uint256 motherId;
        uint256 birthDay;
        bytes32 earTag;
        bool gender;
        uint256 wrCount;
        uint256 hrCount;
        uint256 transferCount;
        uint256 stateCount;
        bool status;
        uint256 timeUpdated;
        uint256 timeCreated;
    }

    struct WeightRecord {
        address actor;
        uint256 lsId;
        uint16 weight;
        uint16 length;
        uint16 heartGrith;
        uint256 timeRecord;
        uint256 timeCreated;
    }

    struct HealthRecord {
        address actor;
        uint256 lsId;
        bool sick;
        bytes32 description;
        bytes32 action;
        uint256 timeRecord;
        uint256 timeCreated;
    }

    /// @dev Untuk mengetahui total semua hewan ternak yang terdapat pada blockchain.
    uint256 public globalLSCount = 0;

    /// @dev Menyimpan data struct Cowshed berdasarkan address yang dimiliki.
    mapping(address => Cowshed) public cowsheds;
    address[] public cowshedAddress;

    /// @dev Meyimpan data scruct livestock berdarsarkan id.
    mapping(uint256 => Livestock) public livestocks;

    /// @dev Menyimpan data livestock dan rasnya.
    mapping(uint256 => Race) public livestockRace;

    /// @dev Untuk mengetahui hewan ternak dimiliki oleh owner.
    mapping(uint256 => address) public livestockOwner;

    /// @dev Untuk mengetahui banyaknya hewan ternak yang dimiliki oleh owner.
    mapping(address => uint256) public livestockCounts;

    //WeightRecord[][] public wRecords;
    /// @dev Menyimpan data stuct WeightRecord atau riwayat berat badan berdasarkan
    ///  id dari hewan ternak.
    mapping(uint256 => mapping(uint256 => WeightRecord)) public wRecords;
    //uint256 wRecordsCount;

    /// @dev Menyimpan data stuct HealthRecord atau riwayat kesehatan berdasarkan
    ///   id dari hewan ternak.
    mapping(uint256 => mapping(uint256 => HealthRecord)) public hRecords;

    /// @dev Menyimpan state dari hewan ternak berdasarkan id hewan ternak.
    ///   Hal ini dgunakan untuk mengetahui tahap yang dilalui hewan ternak.
    mapping(uint256 => mapping(uint256 => State)) public livestockStates;

    /// @dev Menyimpan address pemilik dari hewan ternak. Sehingga ketika dipanggil
    ///   riwayat pemilik dari hewan ternak dapat dilihat.
    mapping(uint256 => mapping(uint256 => address)) public livestockTransfers;

    event RegisterCowshed(address ownerId, string description);

    event RegisterLivestock(
        address ownerId,
        uint256 lsId,
        bool gender,
        Race race,
        string description
    );

    event AddWeight(
        address ownerId,
        uint256 lsId,
        bool gender,
        uint16 weight,
        uint16 length,
        uint16 heartGrith,
        string description
    );

    event AddHealth(
        address ownerId,
        uint256 lsId,
        bool gender,
        bool sick,
        string action,
        string description
    );

    event Transfer(
        uint256 lsId,
        address _from,
        address _to,
        State state,
        string description
    );

    event livestockStatus(
        uint256 id,
        address actor,
        bool status,
        string description
    );

    function registerCowshed(
        address _address,
        string memory _name,
        uint8 _role
    ) public {
        registerUser(_address, _name, _role);

        User storage _user = users[_address];
        require(_user.active, "Anda tidak terdaftar.");

        Cowshed storage _cowshed = cowsheds[_address];
        require(!_cowshed.status, "Kandang sudah ada.");

        cowsheds[_address].ownerId = _address;
        //farms[msg.sender].livestockCount = 0;
        cowsheds[_address].timeUpdated = block.number;
        cowsheds[_address].timeCreated = block.number;
        cowsheds[_address].status = true;

        cowshedAddress.push(_address);

        emit RegisterCowshed(msg.sender, "Kandang telah ditambahkan.");
    }

    function registerLivestock(
        uint256 _fatherId,
        uint256 _motherId,
        uint256 _birthDay,
        string memory _eartag,
        bool _gender,
        uint8 _race,
        uint16 _weight,
        uint16 _length,
        uint16 _heartGrith,
        uint256 _time
    ) public onlyFarmer {
        // uint256 id = livestocks.length + 1;

        // Livestock memory newLivestock;
        // newLivestock.lsId = id;
        // newLivestock.currentFarm = msg.sender;
        // newLivestock.fatherId = _fatherId;
        // newLivestock.motherId = _motherId;
        // newLivestock.birthDay = _birthDay;
        // newLivestock.earTag = stringToBytes32(_eartag);
        // newLivestock.gender = Gender(_gender);
        // newLivestock.wrCount = 0;
        // newLivestock.status = true;
        // newLivestock.timeCreated = block.number;
        // newLivestock.timeUpdated = block.number;
        // livestocks.push(newLivestock);

        Cowshed storage _cowshed = cowsheds[msg.sender];
        require(_cowshed.status == true, "Tidak memiliki kandang");

        uint256 newId = globalLSCount + 1;

        livestocks[globalLSCount].lsId = newId;
        livestocks[globalLSCount].fatherId = _fatherId;
        livestocks[globalLSCount].motherId = _motherId;
        livestocks[globalLSCount].birthDay = _birthDay;
        livestocks[globalLSCount].earTag = stringToBytes32(_eartag);
        livestocks[globalLSCount].gender = _gender;
        livestocks[globalLSCount].transferCount = 1;
        livestocks[globalLSCount].status = true;
        livestocks[globalLSCount].timeCreated = block.number;
        livestocks[globalLSCount].timeUpdated = block.number;
        livestocks[globalLSCount].farmIndex = cowsheds[msg.sender].lsId.length;

        //_farm.livestockCount++;
        _cowshed.lsId.push(newId);

        livestockCounts[msg.sender]++;
        livestockOwner[globalLSCount] = msg.sender;
        livestockTransfers[globalLSCount][0] = msg.sender;
        livestockRace[globalLSCount] = Race(_race);

        changeState(newId, msg.sender);

        registerWRecord(newId, _weight, _length, _heartGrith, _time);

        globalLSCount++;

        emit RegisterLivestock(
            msg.sender,
            newId,
            _gender,
            Race(_race),
            "Sapi berhasil ditambahkan."
        );
    }

    function registerWRecord(
        uint256 _lsId,
        uint16 _weight,
        uint16 _length,
        uint16 _heartGrith,
        uint256 _time
    ) public {
        /*WeightRecord memory newWRecord;
        
        newWRecord.lsId = _lsId;
        newWRecord.weight = _weight;
        newWRecord.length = _length;
        newWRecord.height = _height;
        newWRecord.latest = true;
        newWRecord.timeCreated = block.number;
        newWRecord.timeUpdated = block.number;
        
        wRecords.push(newWRecord);*/

        //wRecordsCount++;

        //Livestock storage ls = livestocks[_lsId - 1];

        //wRecords[wRecordsCount] = WeightRecord(wRecordsCount, _lsId, _weight, _length, _height, block.number, block.number);

        address owner = livestockOwner[_lsId - 1];

        require(owner == msg.sender, "Bukan pemilik");

        uint256 x = livestocks[_lsId - 1].wrCount;
        wRecords[_lsId - 1][x] = WeightRecord({
            actor: msg.sender,
            lsId: _lsId,
            weight: _weight,
            length: _length,
            heartGrith: _heartGrith,
            timeRecord: _time,
            timeCreated: block.number
        });

        Livestock storage _livestock = livestocks[_lsId - 1];

        _livestock.wrCount++;
        _livestock.timeUpdated = block.number;

        emit AddWeight(
            msg.sender,
            _lsId,
            _livestock.gender,
            _weight,
            _length,
            _heartGrith,
            "Riwayat berat badan sapi berhasil ditambahkan."
        );
    }

    function registerHRecord(
        uint256 _lsId,
        string memory _description,
        string memory _action,
        uint256 _time,
        bool _sick
    ) public {
        /*WeightRecord memory newWRecord;
        
        newWRecord.lsId = _lsId;
        newWRecord.weight = _weight;
        newWRecord.length = _length;
        newWRecord.height = _height;
        newWRecord.latest = true;
        newWRecord.timeCreated = block.number;
        newWRecord.timeUpdated = block.number;
        
        wRecords.push(newWRecord);*/

        //wRecordsCount++;

        //Livestock storage ls = livestocks[_lsId - 1];

        //wRecords[wRecordsCount] = WeightRecord(wRecordsCount, _lsId, _weight, _length, _height, block.number, block.number);

        address owner = livestockOwner[_lsId - 1];

        require(owner == msg.sender, "Bukan pemilik");

        uint256 x = livestocks[_lsId - 1].hrCount;
        hRecords[_lsId - 1][x] = HealthRecord({
            actor: msg.sender,
            lsId: _lsId,
            sick: _sick,
            description: stringToBytes32(_description),
            action: stringToBytes32(_action),
            timeRecord: _time,
            timeCreated: block.number
        });

        Livestock storage _livestock = livestocks[_lsId - 1];

        _livestock.hrCount++;
        _livestock.timeUpdated = block.number;

        emit AddHealth(
            msg.sender,
            _lsId,
            _livestock.gender,
            _sick,
            _action,
            "Riwayat berat badan sapi berhasil ditambahkan."
        );
    }

    //function getWeightRecord(uint256 _lsid)

    function getLivestock(uint256 _id)
        public
        view
        returns (
            uint256 _lsId,
            uint256 _fatherId,
            uint256 _motherId,
            uint256 _birthDay,
            bytes32 _eartag,
            bool _gender,
            bool _status,
            Race _race,
            uint256 _timeUpdated,
            uint256 _timeCreated
        )
    {
        Livestock storage ls = livestocks[_id - 1];

        _lsId = ls.lsId;
        _fatherId = ls.fatherId;
        _motherId = ls.motherId;
        _birthDay = ls.birthDay;
        _eartag = ls.earTag;
        _gender = ls.gender;
        _race = livestockRace[_id - 1];
        _status = ls.status;
        _timeUpdated = ls.timeUpdated;
        _timeCreated = ls.timeCreated;
    }

    function getLastWR(uint256 _id)
        public
        view
        returns (
            uint256 _lsId,
            uint16 _weight,
            uint16 _length,
            uint16 _heartGrith,
            uint256 _timeCreated
        )
    {
        uint256 x = livestocks[_id - 1].wrCount;

        WeightRecord storage wr = wRecords[_id - 1][x - 1];
        _lsId = wr.lsId;
        _weight = wr.weight;
        _length = wr.length;
        _heartGrith = wr.heartGrith;
        _timeCreated = wr.timeCreated;
    }

    /// @dev getFarmLS digunakan utnuk mecari id livestock yang telah disimpan
    ///   didalam array int lsId. uint256[] memory diperlukan untuk memanggil array.
    /// @param _from merupakan address yang ingin diketahui livestocknya.
    /// @param _ls merupakan retruns yang akan diberikan berupa array.
    function getFarmLS(address _from)
        public
        view
        returns (uint256[] memory _ls)
    {
        Cowshed storage _cowshed = cowsheds[_from];
        _ls = _cowshed.lsId;
    }

    function excludeRPH(address _address) internal view {
        User storage _user = users[_address];
        require(_user.role != Role(2), "Alamat salah.");
    }

    function transfer(
        uint256 _id,
        address _from,
        address _to
    ) public {
        address owner = livestockOwner[_id - 1];

        require(owner == msg.sender, "Bukan pemilik.");

        // Tambah transferCount yang terdapat di id livestock yang akan ditransfer.
        uint256 x = livestocks[_id - 1].transferCount;
        livestockTransfers[_id - 1][x] = _to;

        // Deklarasi livestock untuk diambil index sebelum dihapus.
        Livestock storage _ls = livestocks[_id - 1];
        uint256 index = _ls.farmIndex;
        // Check apakah hewan ternak masih ada atau tidak.
        require(_ls.status, "Tidak terdapat hewan ternak.");

        // Deklarasi _add untuk peternakan yang ingin ditambahkan hewan ternak.
        Cowshed storage _add = cowsheds[_to];
        require(_add.status, "Tidak ada kandang");

        // Deklarasi _remove untuk peternakan yang ingin dikurangi hewan ternaknya.
        Cowshed storage _remove = cowsheds[_from];
        require(_remove.status, "Tidak ada kandang");

        // Alamat yang dituju tidak boleh alamat RPH
        excludeRPH(_to);

        // Tambah hewan ternak pada address yang dituju.

        // Ubah farmIndex pada hewan ternak berdasarkan ukuran lsId peternakan.
        _ls.farmIndex = _add.lsId.length;
        // Menambah transferCount untuk iterasi livestockTransfers.
        _ls.transferCount++;
        // Push lsId peternakan dengan id hewan ternak yang ditambahkan.
        _add.lsId.push(_id);
        // Menambahkan kepemilikan hewan ternak yang dimiliki oleh peternak.
        livestockCounts[_to]++;
        // Merubah pemilik hewan ternak ke pemilik yang baru.
        livestockOwner[_id - 1] = _to;

        // Merubah state hewan ternak sesuai dengan role pemilik.
        changeState(_id, _to);

        // Kurangi hewan ternak pada address semula.

        // Memindah isi dari index dengan index terakhir.
        _remove.lsId[index] = _remove.lsId[_remove.lsId.length - 1];
        // Menghapus array di index terakhir.
        _remove.lsId.pop();
        // mengurangi kepemilikan hewan ternak yang dimiliki oleh peternak.
        livestockCounts[_from]--;

        emit Transfer(
            _id,
            _from,
            _to,
            State(livestockStates[_id - 1][_ls.stateCount]),
            "Hewan ternak berhasil di transfer"
        );
    }

    /// @dev changeState dugunakan untuk merubah sate dari livetock apakah pada
    ///   state farmer (0), stocker (1), dan butcher (2). State tersebut tergantung
    ///   dari role yang dimiliki oleh address.
    /// @param _id merupakan id livestok yang akan diubah.
    /// @param _to merupakan address owner dari livestock tersebut.
    function changeState(uint256 _id, address _to) public {
        Livestock storage _ls = livestocks[_id - 1];
        uint256 x = _ls.stateCount;

        uint8 role = getRole(_to);

        State _state;

        if (role == 0) {
            _state = State(0);
        } else if (role == 1) {
            _state = State(1);
        } else if (role == 2) {
            _state = State(2);
        }

        livestockStates[_id - 1][x] = _state;

        _ls.stateCount++;
    }

    /// @dev changeStatus Digunakan untuk merubah status dari hewan ternak dari true
    ///   menjadi false, atau dari hidup menjadi mati.
    /// @param _id merupakan id dari hewan ternak.
    function changeStatus(uint256 _id) public onlyFarmer {
        address owner = livestockOwner[_id - 1];

        require(owner == msg.sender, "Bukan pemilik.");

        Livestock storage _ls = livestocks[_id - 1];
        _ls.status = false;

        emit livestockStatus(
            _id,
            msg.sender,
            false,
            "Status hewan ternak telah diubah."
        );
    }

    function stringToBytes32(string memory source)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 _bytes32)
        public
        pure
        returns (string memory)
    {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}

/**
 * @title SlaughterManager
 * @dev Mengontrol pemrosesan sapi menjadi daging
 */
contract SlaughterManager is LivestockManager {
    struct Beef {
        uint256 beefId;
        uint256 lsId;
        uint256 dateAnte;
        uint256 datePost;
        uint256 datePack;
        bool ante;
        bool post;
        address slaughterHouse;
        bytes32 desc;
        uint256 timeCreated;
        uint256 timeUpdated;
    }

    /// @dev Untuk mengetahui total semua livestock yang akan dijadikan beef;
    uint256 public beefCount = 0;

    /// @dev Menyimpan strtuct Beef sebagai data apakah livestock tersebut akan dijadikan daging.
    mapping(uint256 => Beef) public beefs;

    /// @dev Sebagai penunjuk apakah beef disetujui atau tidak oleh RPH.
    mapping(uint256 => address) public beefApproval;

    mapping(address => mapping(uint256 => uint256)) public beefAprroveds;
    mapping(address => uint256) public approveCount;

    mapping(address => mapping(uint256 => uint256)) public beefDenieds;
    mapping(address => uint256) public deniedCount;

    event RegisterBeef(
        address ownerId,
        address butcher,
        uint256 lsId,
        uint256 beefId,
        string description
    );

    event Antemortem(
        uint256 beefId,
        uint256 lsId,
        address butcher,
        bool approved,
        string description
    );

    event Postmortem(
        uint256 beefId,
        uint256 lsId,
        address butcher,
        bool approved,
        string description
    );

    event PackBeef(
        uint256 beefId,
        uint256 lsId,
        address butcher,
        string description
    );

    event StateToBeef(uint256 lsId, address butcher, string description);

    /// @dev registerBeef merupakan fungsi yang diugnakan untuk menambah livestock yang
    ///   akan diubah menjadi beef.
    /// @param _id digunakan untuk mengetahui livestok yang akan diubah.
    /// @param _to digunakan untuk mengetahui tempat pemotongan livetock.
    function registerBeef(uint256 _id, address _to) public onlyStocker {
        address owner = livestockOwner[_id - 1];
        require(owner == msg.sender, "Bukan pemilik.");

        User storage _user = users[_to];
        require(_user.role == Role(2), "Alamat RPH salah.");

        Livestock storage _ls = livestocks[_id - 1];
        require(_ls.status, "Hewan ternak tidak ada");

        uint256 newId = beefCount + 1;

        beefs[beefCount].beefId = newId;
        beefs[beefCount].lsId = _id;
        beefs[beefCount].slaughterHouse = _to;
        beefs[beefCount].timeCreated = block.number;
        beefs[beefCount].timeUpdated = block.number;

        beefApproval[beefCount] = _to;

        beefCount++;

        emit RegisterBeef(
            livestockOwner[_id - 1],
            _to,
            _id,
            newId,
            "Pembuatan beef berhasil ditambahkan."
        );
    }

    /// @dev checkAntemortem merupakan fungsi yang digunakan untuk merubah atribut pada struct
    ///   beef seperti ante dan dateAnte, sehingga dapat diketahui, sapi diterima atau tidak.
    /// @param _id Merupakan id dari beef yang akan dipotong. id tidak boleh 0.
    /// @param _epox Merupakan tanggal yang dikonversikan menjadi integer.
    /// @param _approval Merupakan input dari user apakah setuju atau tidak.
    /// @param _desc Merupakan deskripsi yang dimasukkan oleh user jika menolak sapi.
    function checkAntemortem(
        uint256 _id,
        uint256 _epox,
        bool _approval,
        string memory _desc
    ) public onlyButcher {
        address slaughter = beefApproval[_id - 1];
        require(
            slaughter == msg.sender,
            "Rumah Pemotongan Hewan tidak dapat melakukan aksi."
        );

        Beef storage _beef = beefs[_id - 1];
        _beef.dateAnte = _epox;

        if (_approval == true) {
            _beef.ante = true;

            // Merubah state livestock menjadi butcher.
            uint256 lsId = _beef.lsId;

            Livestock storage _ls = livestocks[lsId - 1];
            uint256 x = _ls.stateCount;
            livestockStates[lsId - 1][x] = State.butcher;
            _ls.stateCount++;
        } else {
            _beef.ante = false;
            _beef.desc = stringToBytes32(_desc);

            beefDenieds[msg.sender][deniedCount[msg.sender]] = _id;
            deniedCount[msg.sender]++;
        }

        _beef.timeUpdated = block.number;

        emit Antemortem(
            _id,
            _beef.lsId,
            _beef.slaughterHouse,
            _approval,
            "Telah dilakukan pemeriksaan antemortem."
        );
    }

    /// @dev checkPostmortem Merupakan fungsi yang digunakan untuk merubah atribut pada struct
    ///   beef seperti post dan datePost, sehingga dapat diketahui, daging yang dipotong sehat.
    /// @param _id Merupakan id dari beef yang akan dipotong. id tidak boleh 0.
    /// @param _epox Merupakan tanggal yang dikonversikan menjadi integer.
    /// @param _approval Merupakan input dari user apakah setuju atau tidak.
    /// @param _desc Merupakan deskripsi yang dimasukkan oleh user jika terdapat penyakit.
    function checkPostmortem(
        uint256 _id,
        uint256 _epox,
        bool _approval,
        string memory _desc
    ) public onlyButcher {
        address slaughter = beefApproval[_id - 1];
        require(
            slaughter == msg.sender,
            "Rumah Pemotongan Hewan tidak dapat melakukan aksi."
        );

        Beef storage _beef = beefs[_id - 1];

        require(
            _beef.ante == true,
            "Antemortem ditolak, sehingga tidak bisa dilanjutkan"
        );

        _beef.datePost = _epox;

        slaughtering(_id);

        if (_approval == true) {
            _beef.post = true;

            beefAprroveds[msg.sender][approveCount[msg.sender]] = _id;
            approveCount[msg.sender]++;
        } else {
            _beef.post = false;
            _beef.desc = stringToBytes32(_desc);

            beefDenieds[msg.sender][deniedCount[msg.sender]] = _id;
            deniedCount[msg.sender]++;
        }

        _beef.timeUpdated = block.number;

        emit Postmortem(
            _id,
            _beef.lsId,
            _beef.slaughterHouse,
            _approval,
            "Telah dilakukan pemeriksaan postmortem."
        );
    }

    /// @dev packingBeef Merupakan fungsi yang digunakan untuk merubah atribut pada struct
    ///   beef seperti datePack. Hal ini dilakukan untuk mengetahui tanggal daging dipacking.
    /// @param _id Merupakan id dari beef yang akan dipacking. id tidak boleh 0.
    /// @param _epox Merupakan tanggal yang dikonversikan menjadi integer.
    function packingBeef(uint256 _id, uint256 _epox) public onlyButcher {
        address slaughter = beefApproval[_id - 1];
        require(
            slaughter == msg.sender,
            "Rumah Pemotongan Hewan tidak dapat melakukan aksi."
        );

        Beef storage _beef = beefs[_id - 1];

        require(
            _beef.ante == true,
            "Antemortem ditolak, sehingga tidak bisa dilanjutkan"
        );

        require(
            _beef.post == true,
            "Postmortem ditolak, sehingga tidak bisa dilanjutkan"
        );

        _beef.datePack = _epox;
        _beef.timeUpdated = block.number;

        // Merubah state livestock menjadi beef.
        uint256 lsId = _beef.lsId;

        Livestock storage _ls = livestocks[lsId - 1];
        uint256 x = _ls.stateCount;
        livestockStates[lsId - 1][x] = State.beef;
        _ls.stateCount++;

        emit StateToBeef(
            lsId,
            msg.sender,
            "State hewan ternak dirubah menjadi beef"
        );

        emit PackBeef(
            _id,
            _beef.lsId,
            _beef.slaughterHouse,
            "Telah dilakukan pembungkusan daging."
        );
    }

    /// @dev slaughtering Digunakan untuk merubah status dari hewan ternak dari true
    ///   menjadi false, atau dari hidup menjadi mati.
    /// @param _id merupakan id dari beef.
    function slaughtering(uint256 _id) public onlyButcher {
        address slaughter = beefApproval[_id - 1];
        require(
            slaughter == msg.sender,
            "Rumah Pemotongan Hewan tidak dapat melakukan aksi."
        );

        Beef storage _beef = beefs[_id - 1];

        require(
            _beef.ante == true,
            "Antemortem ditolak, sehingga tidak bisa dilanjutkan"
        );

        uint256 _lsId = _beef.lsId;

        Livestock storage _ls = livestocks[_lsId - 1];
        _ls.status = false;

        emit livestockStatus(
            _id,
            msg.sender,
            false,
            "Status hewan ternak telah diubah."
        );
    }
}
