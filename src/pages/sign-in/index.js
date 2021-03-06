import React from 'react'
import { Route, Link } from 'react-router-dom'

import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn } from '../../actions/account'
import { getCaptchaId } from '../../actions/captcha'

// import Promise from 'promise'
//
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import config from '../../../config'

// 纯组件
export class SignIn extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      captchaId: ''
    }
    this.submit = this.submit.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {
    this.getCaptcha()
  }

  getCaptcha() {
    const self = this
    const { getCaptchaId } = this.props
    getCaptchaId((res)=>{

      console.log(res);

      if (res && res.success && res.data) {
        self.setState({
          captchaId: res.data
        })
      }
    })
  }

  submit(event) {

    event.preventDefault()

    const { signIn } = this.props
    const { account, password, submit, captcha } = this.refs
    const { captchaId } = this.state

    if (!account.value) return account.focus()
    if (!password.value) return password.focus()

    submit.value = '登录中...'
    submit.disabled = true

    let data = {
      email: account.value.indexOf('@') != -1 ? account.value : '',
      phone: account.value.indexOf('@') == -1 ? account.value : '',
      password: password.value
    }

    if (captcha) data.captcha = captcha.value
    if (captchaId) data.captcha_id = captchaId

    signIn({
      data,
      callback: (result) => {

      submit.value = '登录'
      submit.disabled = false

      console.log(result);

      // if (!result.success) {
      //   _self.refreshCaptcha()
      //   _self.setState({ error: result.error })
      //   return;
      // }

      // setTimeout(()=>{
      //   location.reload()
      // }, 100)

    }})


    return false
  }

  render() {

    const { captchaId } = this.state

    return(<div styleName="container">

      <h2>登陆小度鱼后台</h2>
      
      <form className="form" onSubmit={this.submit}>
        <input ref="account" type="text" placeholder="Email or Phone"/>
        <input ref="password" type="password" placeholder="Password"/>
        {captchaId ? <div>
            <input type="text" className="input" placeholder="请输入验证码" ref="captcha" />
            <img className={styles['captcha-image']} onClick={this.getCaptcha} src={`${config.api_url}/${config.api_verstion}/captcha-image/${captchaId}`} />
          </div> : null}
        <input ref="submit" className="btn" type="submit" value="登录"/>
      </form>


    </div>)
  }

}

SignIn = CSSModules(SignIn, styles)


SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  getCaptchaId: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: bindActionCreators(signIn, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch)
  }
}

SignIn = connect(mapStateToProps,mapDispatchToProps)(SignIn)

export default SignIn
