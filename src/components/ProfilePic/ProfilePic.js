import React from 'react'
import Identicon from 'identicon.js'

const ipfsClient = require('ipfs-http-client'),
      ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class ProfilePic extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      interface: this.props.interface,
      userStorage: this.props.userStorage,
      picHash: null,
      hasPic: false
    }
  }
  async findPic() {
    if(this.state.userStorage) {
      this.setState({
        picHash: await this.state.userStorage.methods.getProfilePic.call()
      })
    }
  }

  captureFile(e) {
    e.preventDefault()
    // pre-processes file so it can be uploaded to IPFS
    const file = e.target.files[0] // reads file off HTML element
    const reader = new window.FileReader() // native File Reader from JS
    reader.readAsArrayBuffer(file) // reads file as Array Buffer

    reader.onloadend = () => {
      // converts file to Buffer object for IPFS
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  // upload image to IPFS and blockchain
  uploadImage() {
    this.props.handleBanner([
      'Waiting',
      'Profile Pic',
      this.state.account + '-profile-pic'
    ])
    console.log("Submitting file to IPFS...")

    // add file to IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }
      // add image to User
      this.setState({ loading: true })
      this.state.interface.methods
        .newProfilePic(this.state.account, result[0].hash)
        .send({ from: this.state.account })
        .on('transactionHash', hash => {
          this.setState({ loading: false })
          this.props.handleBanner([
            'Writing',
            'Profile Pic',
            this.state.account + '-profile-pic'
          ])
        })
        .on('receipt', () => {
          this.props.handleBanner([
            'Success',
            'Profile Pic',
            this.state.account + '-profile-pic'
          ])
        })
        .catch(e => {
          this.props.handleBanner([
            'Cancel',
            'Profile Pic',
            this.state.account + '-profile-pic'
          ])
          console.error(e)
        })
      console.log('from: ' + this.state.account)
    })
  }

  render() {
    return(
      <div id="profilePic">
        { this.state.interface
            ? <div id="isEditable">
                <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile}/>
                { this.state.picHash
                  ? <img
                      id="profile-pic"
                      alt="profile-pic"
                    />
                  : <img
                      className="ProfilePic" id="profile-pic"
                      width="140"
                      height="140"
                      alt="profile-pic"
                      src={`data:image/png;base64,${
                          new Identicon(this.props.account, 120).toString()
                      }`}
                    />
                }
              </div>
            : this.state.picHash
                ? <img
                    id="profile-pic"
                    alt="profile-pic"
                  />
                : <img
                    className="ProfilePic" id="profile-pic"
                    width="140"
                    height="140"
                    alt="profile-pic"
                    src={`data:image/png;base64,${
                        new Identicon(this.props.account, 120).toString()
                    }`}
                  />
        }
      </div>
    )
  }
}

export default ProfilePic
