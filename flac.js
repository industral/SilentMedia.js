/* https://xiph.org/flac/format.html */

function FLACDecoder(arrayBuffer) {
  var data = arrayBuffer;
  var datanav = new DataView(data);

  this.parse = function() {
    return this.STREAM();
  };

  this.STREAM = function() {
    return {
      id: getId(),
      METADATA_BLOCK: {
        METADATA_BLOCK_HEADER: getHeader(),
        METADATA_BLOCK_DATA: getStreamInfo()
      }
    }
  };

  function getId() {
    return [].map.call(new Uint8Array(data, 0, 4), (value) => {
      return String.fromCharCode(value); // 102, 76, 97, 67 => fLaC
    }).join('');
  }

  function getHeader() {
    const BLOCK_TYPE = ['STREAMINFO', 'PADDING', 'APPLICATION', 'SEEKTABLE',
      'VORBIS_COMMENT', 'CUESHEET', 'PICTURE'];

    var blockInfo = datanav.getUint32(4);
    var blockLenght = blockInfo & 0xFFFFFF;
    var lastBlock = blockInfo >> 3 & 0x1;
    var blockType = blockInfo >> 3 & 0xfe;

    return {
      lastBlock: !!lastBlock,
      blockType: BLOCK_TYPE[blockType],
      length: blockLenght
    }
  }

  function getStreamInfo() {
    console.log(new Uint8Array(data, 26, 16));

    return {
      'min block size': datanav.getUint16(8),
      'max block size': datanav.getUint16(10),
      'min frame size': datanav.getUint32(12) >> 8,
      'max frame size': datanav.getUint32(15) >> 8,
      'sample rate': datanav.getUint32(18) >> 12,
      'num of channels': (datanav.getUint32(18) >> 9 & 0x7) + 1,
      'bits per sample': (datanav.getUint32(18) >> 4 & 0x1F) + 1,
      //'total samples': datanav.getFloat64(18) & 0xFFFFFFFFF,
      //'md5': (datanav.getUint32(26)),

    }
  }

  getSeekTableINfo();

  function getSeekTableINfo() {
  }

}
