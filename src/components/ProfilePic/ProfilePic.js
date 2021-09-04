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
                id="profile-pic"
              />
            : <img
                className="ProfilePic" id="profile-pic"
                width="120"
                height="120"
                src={`data:image/png;base64,${
//                  this.props.hasEntered
                    new Identicon(this.props.account, 120).toString()
//                    : null
                }`}
              />
          }
      </div>
    )
  }
}

export default ProfilePic
