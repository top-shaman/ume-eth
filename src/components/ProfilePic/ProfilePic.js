import React from 'react'
import Identicon from 'identicon.js'

class ProfilePic extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      hasPic: false
    }
  }

  render() {
    return(
      <div id="profilePic">
          { this.state.hasPic
            ? <img
                className="CreateUser" id="profile-pic-user"
              />
            : <img
                className="CreateUser" id="profile-pic-auto"
                width="120"
                height="120"
                src={`data:image/png;base64,${
                  this.props.hasEntered
                    ? new Identicon(this.props.account, 120).toString()
                    : null
                }`}
              />
          }
      </div>
    )
  }
}

export default ProfilePic
