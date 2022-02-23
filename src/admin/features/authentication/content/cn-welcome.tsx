import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom"
import { useAuth } from '@admin/features/authentication/context/auth.context';
import {
  makeStyles,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
} from '@fluentui/react';
import classNames from 'classnames';
import WxLoginBtn from '@admin/features/authentication/components/wx-login';
import PhoneLoginForm from '@admin/features/authentication/components/phone-login';

import logo from '../../../assets/logo.svg';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  wrapper: {
    width: 360,
    marginLeft: 'auto !important',
    marginRight: 'auto !important',
    textAlign: 'left',
    marginBottom: '2%'
  },
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#faf9f8'
  },
  card: {
    marginBottom: '2rem'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    textAlign: 'center',
    marginBottom: '1rem !important'
  },
  button: {
    width: '100%'
  },
  alert: {
    marginBottom: '1rem !important',
    textAlign: 'center'
  },
  logo: {
    margin: '0 auto 0.5rem 0',
    display: 'block'
  }
});



const Welcome: React.FC<any> = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [sucessMessage, setSucessMessage] = useState('');
  let location = useLocation();
  useEffect(() => {
    if (location.search === "") {
      return
    }
    const query = new URLSearchParams(location.search)
    const errorMsg = query.get('error')
    if (errorMsg == "") {
      return
    }
    try {
      const errorObj = JSON.parse(errorMsg)
      if (errorObj.code > 0) {
        setShowError(true)
        setErrorMsg(`错误:${errorObj.code} ${errorObj.msg}`)
      }
    } catch (e) {
    }
  }, [location]);

  const onPhoneLoginError = (data: { code: number, message: string }) => {
    console.log(data.code, data.message);
    if (data.code != 0) {
      setShowError(true)
      setErrorMsg(`错误:${data.code} ${data.message}`)
    } else {
      setShowError(false)
      setErrorMsg(``)
      setSucessMessage(data.message)
      setShowSuccess(true)
    }
  }
  return (
    <div className={styles.container}>
      <div className={classNames(styles.wrapper, 'card')}>
        <img
          src={logo}
          width={36}
          height={36}
          alt='Burdy'
          className={styles.logo}
        />
        <Stack tokens={{ childrenGap: 8, padding: '0 0 16px' }}>
          <Text variant='xLargePlus' block>
            {t('welcome.title')}
          </Text>
          <Text variant='medium' block>
            {t('welcome.desc')}
          </Text>
        </Stack>
        {showError && (
          <MessageBar
            className={styles.alert}
            messageBarType={MessageBarType.error}
          >
            {errorMsg}
          </MessageBar>
        )}
        {showSuccess && !showError && (
          <MessageBar
            className={styles.alert}
            messageBarType={MessageBarType.success}
          >
            {sucessMessage}
          </MessageBar>
        )}
        <Stack tokens={{ childrenGap: 10 }}>
          <Stack.Item>
            <PhoneLoginForm useType='init' onError={onPhoneLoginError} />
          </Stack.Item>
          <Stack.Item>
            <WxLoginBtn className={styles.button} useType="init" />
          </Stack.Item>
        </Stack>
      </div >
    </div >
  );
};

export default Welcome;
