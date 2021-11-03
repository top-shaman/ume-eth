import React from 'react'
import Identicon from 'identicon.js'
import './ProfilePic.css'

const ipfsClient = require('ipfs-http-client'),
      ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class ProfilePic extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      picHash: null,
      hasPic: false,
      preview: null,
      tempFile: null
    }

    this.img = React.createRef()
    this.input = React.createRef()

    this.captureFile = this.captureFile.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }
  async componentDidMount() {
    await this.findPic()
  }

  async findPic() {
    if(this.state.userStorage) {
      this.setState({ picHash: await this.state.userStorage.methods.getProfilePic(this.state.account).call() })
    }
  }

  captureFile(e) {
    e.preventDefault()
    // pre-processes file so it can be uploaded to IPFS
    const file = e.target.files[0] // reads file off HTML element
    const reader = new window.FileReader() // native File Reader from JS
    reader.readAsArrayBuffer(file) // reads file as Array Buffer
    const url = URL.createObjectURL(file)

    reader.onloadend = async () => {
      // converts file to Buffer object for IPFS
      this.setState({
        buffer: Buffer(reader.result),
        preview: await url
      })
      console.log('buffer', this.state.buffer)
      this.props.handleBuffer(this.state.buffer)
    }
  }

  // upload image to IPFS and blockchain
  uploadImage() {
    console.log("Submitting file to IPFS...")

    // add file to IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result[0].hash)
      if(error) {
        console.error(error)
        return
      }
      // add image to User
      console.log(result)
      this.state.interface.methods
        .newProfilePic(this.state.account, result[0].hash)
        .send({from: this.state.account})
        .on('transactionHash', () => {
          this.props.handleBanner([
            'Writing',
            'Profile Pic',
            this.state.account + '-profile-pic'
          ])
          this.handleClose()
        })
        .on('receipt', () => {
          this.props.handleBanner([
            'Success',
            'Profile Pic',
            this.state.account + '-profile-pic'
          ])
        })
        .catch(e => {
          this.props.handleError([
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
                { this.state.picHash
                  ? <img
                      className="ProfilePic"
                      id="profile-pic"
                      alt="profile-pic"
                      width="140"
                      height="140"
                      src={`https://ipfs.infura.io/ipfs/${this.state.picHash}`}
                      ref={Ref=>this.img=Ref}
                    />
                  : this.state.preview
                      ? <img
                          className="ProfilePic"
                          id="profile-pic"
                          width="140"
                          height="140"
                          alt="profile-pic"
                          src={this.state.preview}
                          ref={Ref=>this.preview=Ref}
                        />
                      : <img
                          className="ProfilePic" id="profile-pic"
                          width="140"
                          height="140"
                          alt="profile-pic"
                          src={`data:image/png;base64,${
                            new Identicon(this.props.account, 120).toString()
                          }`}
                          ref={Ref=>this.img=Ref}
                        />
                }
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .gif"
                onChange={this.captureFile}
                ref={Ref=>this.input=Ref}
              />
              </div>
            : this.state.picHash
                ? <img
                    className="ProfilePic"
                    id="profile-pic"
                    alt="profile-pic"
                    width="140"
                    height="140"
                    src={`https://ipfs.infura.io/ipfs/${this.state.picHash}`}
                    ref={Ref=>this.img=Ref}
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
