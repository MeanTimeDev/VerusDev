import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  Text,
  Alert,
} from 'react-native';
import {
  selectWyreAccount,
  selectWyreGetAccountIsFetching,
} from '../../../../selectors/paymentMethods';
import PrimeTrustInterface from '../../../../utils/PrimeTrust/provider';

import {
  Input,
  Button,
  CheckBox
} from 'react-native-elements';

import Styles from '../../../../styles/index';

import Colors from '../../../../globals/colors';

import { NavigationActions } from '@react-navigation/compat'

class KYCLogin extends Component {
constructor(props) {
  super(props)
  if(PrimeTrustInterface.jwt != null){
    this.props.navigation.navigate("KYCInfoScreen");
  }
  this.state = {
    userName: "",
    userEmail: "",
    userPassword: "",
    checked: false
  };
  
}

  componentDidMount() {

  }

  componentWillUnmount() {

  }

onChangeName = (input) => { this.setState({ userName: input }) }
onChangeEmail = (input) => { this.setState({ userEmail: input }) }
onChangePassword = (input) => { this.setState({ userPassword: input }) }


onCancel = () => {
    console.log(`${this.state.userName}, ${this.state.userEmail}, ${this.state.userPassword}`)
    this.props.navigation.dispatch(NavigationActions.back());

  }

onLogin = async () => {
  console.log(`${this.state.userName}, ${this.state.userEmail}, ${this.state.userPassword}`)

  let login = await PrimeTrustInterface.loginUser(this.state.userEmail,this.state.userPassword);
  if( login.success === true){
    this.props.navigation.navigate("KYCInfoScreen");
    //load the user
    await PrimeTrustInterface.getUser();
  } else {
    console.log(signup.error);
    let message = "";
    if(signup.error.source.pointer == "/data/attributes/email") {
      message = "Email " + signup.error.detail;
    } else {
      message = signup.error.source.pointer + signup.error.detail;
    }
    Alert.alert("Login failed", message );
  }
}


onFlip = () => { this.state.checked === true ? this.setState({ checked: false }) : this.setState({ checked: true }) }

  render() {
    return (
      <View style={Styles.rootBlue}>
        <View style={Styles.secondaryBackground }>

          <Input
            label="email"
            labelStyle={Styles.formLabel}
            containerStyle={Styles.wideCenterBlock}
            inputStyle={Styles.inputTextDefaultStyle}
            onChangeText={this.onChangeEmail}
            autoCorrect={false}
          />
          <Input
            label="password"
            labelStyle={Styles.formLabel}
            containerStyle={Styles.wideCenterBlock}
            inputStyle={Styles.inputTextDefaultStyle}
            onChangeText={this.onChangePassword}
            autoCorrect={false}
          />
        </View>
        <View style={ {...Styles.blockWithFlexStart, ...Styles.centralRow }}>
          <View style={Styles.padding}>
            <Button
            title="Login"
            buttonStyle={Styles.defaultButtonWhite}
            titleStyle={Styles.seedText}
            onPress={ this.onLogin }
            />
          </View>

          <View style={Styles.padding}>
            <Button
            title="Sign Up"
            titleStyle={Styles.whiteText}
            buttonStyle={Styles.defaultButtonClearWhite}
            onPress={ this.onCancel }
            type="outline"
            />
          </View>
        </View>
      </ View>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: selectWyreGetAccountIsFetching(state),
  account: selectWyreAccount(state),
});


export default connect(mapStateToProps)(KYCLogin);
