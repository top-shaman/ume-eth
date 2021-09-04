import React from 'react'
import './CreateMeme.css'
import autosize from 'autosize'

class CreateMeme extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    this.textarea.focus()
    autosize(this.textarea)
  }

  handleChange(e) {
  }

  render() {
    return(
      <div className="CreateMeme" id="CreateMeme">
        <div className="CreateMeme-container">
          <section className="CreateMeme-head">
          </section>
          <section className="CreateMeme-body">
            <form className="CreateMeme-form">
              <div className="CreateMeme-textBox">
                  <textarea
                    id="meme"
                    name="meme"
                    className="meme-text"
                    type="text"
                    autoComplete="off"
                    placeholder="What's the meme"
                    rows="5"
                    onChange={this.handleChange}
                    ref={c=>this.textarea=c}
                    required />
              </div>
            </form>
          </section>
        </div>
        <div className="CreateMeme-background">
        </div>
      </div>
    )
  }

}

export default CreateMeme
