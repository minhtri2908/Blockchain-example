const SHA256 = require("crypto-js/sha256"); // thuật toán sha256 dùng để hash data block

//// Ví dụ cấu trúc của 1 block gồm vị trí block, thời gian khởi tạo, dữ liệu, mã hash của block trước đó và mã hash của block.
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }
  //Tạo block đầu tiên
  createGenesisBlock() {
    return new Block(0, new Date().toString(), "The first block", "0");
  }

  //Lấy thông tin block cuối trong chuỗi.
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  //Thêm block vào chuỗi
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
  //Kiểm tra dữ liệu có đang được giữ nguyên hay đã bị sửa đổi
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

const blockchain = new Blockchain();

blockchain.addBlock(
  new Block(1, new Date().toString(), { data: "helloworld" })
);
blockchain.addBlock(
  new Block(2, new Date().toString(), { data: "this is a example blockchain" })
);

console.log(JSON.stringify(blockchain.chain, null, 2));
