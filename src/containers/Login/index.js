import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import { setAppHeight, changePage } from '../../actions/settings';
import { setLoading } from '../../actions/loading';
import { setError, setPassword, setRegistered, setRemainConnected, setUsername } from '../../actions/login';
import styles from './style.scss';
import Checkbox from '../../components/Checkbox';
import ZAF from '../../misc/ZAFClient';

class Login extends React.Component {

  text = 'Utilize a mesma senha cadastrada em seu ramal';
  remainConnected = true;

  componentWillMount() {
    this.props.setAppHeight(290);

    this.props.teravoz.events.on('registering', (payload) => {
      this.props.setLoading(true);
    });
    this.props.teravoz.events.on('registrationFailed', (payload) => {
      ZAF.removeKey('peer');
      this.props.setLoading(false);
      this.props.setError({ message: 'Credenciais incorretas' });
    });
    this.props.teravoz.events.on('registered', (payload) => {
      const { username, password, remainConnected } = this.props;
      if (remainConnected) {
        ZAF.setKey('peer', JSON.stringify({ username, password }));
      }
      this.props.setLoading(false);
      this.props.changePage('dialing');
    });

  }

  componentDidMount() {
    ZAF.getKey('peer').then((peer) => {
      peer = JSON.parse(peer);
      if (peer) {
        this.props.setUsername(peer.username);
        this.props.setPassword(peer.password);
        this.props.teravoz.register(peer);
      }
    }).catch((error) => {
      this.props.setError({ message: 'Erro ao registrar usuário' });
    });
  }
  
  register() {
    const { username, password } = this.props;
    const errors = { username: null, password: null };

    if (!username) {
      errors.username = 'O campo Ramal é obrigatório';
      this.props.setError({ ...errors });
    }
    if (!password) {
      errors.password = 'O campo Senha é obrigatório';
      this.props.setError({ ...errors });
    }

    if (errors.username || errors.password) {
      return;
    }

    this.props.teravoz.register({ username, password });
  }
  
  onCheck() {
    this.setRemainConnected({ remainConnected: !this.props.remainConnected })
  }

  setUsername(e) {
    this.props.setUsername(e.target.value);
  }

  setPassword(e) {
    this.props.setPassword(e.target.value);
  }

  render() {
    const { error } = this.props;
    return (
      <div className={ styles.login }>
        <div className={ styles.login__form }>
          <div className={ styles.login__form__item }>
            <input onChange={ this.setUsername.bind(this) } type="text" placeholder="Ramal" />
            { error && error.username ?
              <span className={ classnames(styles.login__form__item__info, styles.login__form__item__error) }>
                { error.username }
              </span> : null
            }
          </div>
          <div className={ classnames(styles.login__form__item, styles.mt25) }>
            <input onChange={ this.setPassword.bind(this) } type="password" placeholder="Senha" />
            { 
              error && error.password  ?
              <span className={ classnames(styles.login__form__item__info, styles.login__form__item__error) }>
                { error.password }
              </span> : (
                <span className={ styles.login__form__item__info }>
                    { this.text }
                </span>
              )
            }
          </div>

          { error && error.message ?
            <span className={ classnames(styles.login__form__item__info, styles.login__form__item__error) }>
              { error.message }
            </span> : null
          }

          <div className={ styles.login__form__item  + ' ' + styles.mt15 }>
            <Checkbox onCheck={ this.onCheck.bind(this) } checked={ this.props.remainConnected } label="Permanecer conectado" />
          </div>

          <div className={ styles.login__form__item + ' ' + styles.mt30 }>
            <button onClick={ this.register.bind(this) } className={ styles.login__form__item__button }> Acessar </button>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  action: PropTypes.string,
};


const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ changePage, 
    setUsername, 
    setPassword, 
    setRemainConnected,
    setRegistered, 
    setError,
    setLoading
  }, dispatch),
  setAppHeight
});

const mapStateToProps = ({ login, teravoz }) => ({ ...login, teravoz });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

