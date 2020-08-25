const Computer = key => {
  let student = {
    key: key,
    name: '',
    myPackets: []
  }

  return {
    get: () => student,
    addPacket: packet => student.myPackets.push()
  }
}

export default Computer
