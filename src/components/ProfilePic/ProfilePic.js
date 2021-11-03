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
      url: null,
      imgHash: this.props.imgHash,
      registered: this.props.registered,
      loading: false,
      preview: null,
      tempFile: null
    }

    this.img = React.createRef()

    this.captureFile = this.captureFile.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }
  async componentDidMount() {
    if(!this.state.imgHash) {
      await this.findPic()
    } else {
      this.setState({
        url: `https://ipfs.infura.io/ipfs/${this.props.imgHash}`
      })
    }
  }

  async findPic() {
    this.setState({ loading: true })
    if(this.state.userStorage) {
      const hash = await this.state.userStorage.methods.getProfilePic(this.state.account).call()
      if(hash) {
        const url = `https://ipfs.infura.io/ipfs/${hash}`
        this.setState({
          url,
          loading: false
        })
      } else {
        const url = `data:image/png;base64,${new Identicon(this.props.account, 120).toString()}`
        this.setState({
          url,
          loading: false
        })
      }
    } else {
      const url = `data:image/png;base64,${new Identicon(this.props.account, 120).toString()}`
      this.setState({
        url,
        loading: false
      })
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
  async uploadImage() {
    console.log("Submitting file to IPFS...")

    let hash
    // add file to IPFS
    await ipfs.add(this.state.buffer, async (error, result) => {
      console.log('IPFS result', result[0].hash)
      if(error) {
        console.error(error)
        return
      }
      // add image to User
      if(this.state.registered) {
        this.state.interface.methods
          .newProfilePic(this.state.account, result[0].hash)
          .send({from: this.state.account})
          .on('transactionHash', () => {
            this.props.handleBanner([
              'Writing',
              'Profile Pic',
              this.state.account + '-profile-pic'
            ])
            this.props.handleClose()
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
      } else {
        this.props.handleHash(result[0].hash)
      }
      console.log('from: ' + this.state.account)
    })
    return hash
  }

  render() {
    return(
      <div id="profilePic">
        { this.state.loading
            ? <div id="blank"/>
            : this.state.interface
                ? <div id="isEditable">
                    { this.state.preview
                        ? <img
                            className="ProfilePic"
                            id="profile-pic"
                            width="140px"
                            height="140px"
                            alt="profile-pic"
                            src={this.state.preview}
                            ref={Ref=>this.preview=Ref}
                          />
                        : <img
                            className="ProfilePic" id="profile-pic"
                            width="140px"
                            height="140px"
                            alt="profile-pic"
                            src={this.state.url}
                            ref={Ref=>this.img=Ref}
                          />
                    }
                    <div id="banner"/>
                    <input
                      type="file"
                      id="image-select"
                      accept=".jpg, .jpeg, .png, .bmp, .gif"
                      onChange={this.captureFile}
                      ref={Ref=>this.input=Ref}
                    />
                  </div>
                : <img
                    className="ProfilePic"
                    id="profile-pic"
                    alt="profile-pic"
                    width="140px"
                    height="140px"
                    src={this.state.url}
                    ref={Ref=>this.img=Ref}
                  />
        }
      </div>
    )
  }
}

export default ProfilePic
