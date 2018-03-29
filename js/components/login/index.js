import React, { Component } from "react";
import { Image } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser } from "../../actions/user";
import styles from "./styles";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

const background = require("../../../images/shadow.png");

const validate = values => {
  const error = {};
  error.email = "";
  error.password = "";
  var ema = values.email;
  var pw = values.password;
  if (values.email === undefined) {
    ema = "";
  }
  if (values.password === undefined) {
    pw = "";
  }
  if (ema.length < 8 && ema !== "") {
    error.email = "too short";
  }
  if (!ema.includes("@") && ema !== "") {
    error.email = "@ not included";
  }
  if (pw.length > 12) {
    error.password = "max 11 characters";
  }
  if (pw.length < 5 && pw.length > 0) {
    error.password = "Weak";
  }
  return error;
};

class Login extends Component {
  static propTypes = {
    setUser: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.renderInput = this.renderInput.bind(this);
  }

  setUser(name) {
    this.props.setUser(name);
  }
  renderInput({
    input,
    label,
    type,
    meta: { touched, error, warning },
    inputProps
  }) {
    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <Item error={hasError}>
        <Icon active name={input.name === "email" ? "person" : "unlock"} />
        <Input
          placeholder={input.name === "email" ? "EMAIL" : "PASSWORD"}
          {...input}
        />
        {hasError
          ? <Item style={{ borderColor: "transparent" }}>
            <Icon active style={{ color: "red", marginTop: 5 }} name="bug" />
            <Text style={{ fontSize: 15, color: "red" }}>{error}</Text>
          </Item>
          : <Text />}
      </Item>
    );
  }
  render() {
    return (
      <Container>
        <View style={styles.container}>
          <Content>
            <Image source={background} style={styles.shadow}>
              <View style={styles.bg}>
                <Field name="email" component={this.renderInput} />
                <Field name="password" component={this.renderInput} />
                <Button
                  style={styles.btn}
                  onPress={() => this.showFilePicker()}
                >
                  <Text>Select Files</Text>
                </Button>
                <Button
                  style={styles.btn}
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <Text>Login Now</Text>
                </Button>
              </View>
            </Image>
          </Content>
        </View>
      </Container>
    );
  }

  showFilePicker = () => {
    // iPhone/Android
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.images()],
    }, (error, res) => {
      // Android
      console.log(
        res.uri,
        res.type, // mime type
        res.fileName,
        res.fileSize
      );
      var media = {
        uri: res.uri,
        type: res.type,
        name: res.fileName
      };
      
      var data = new FormData();
      data.append("file", media);
      const fileArray = [];
      
      fetch('https://mobile_push_notifier.cfapps.io/service-request/attachments', {
          method: 'POST',
          body: data,
      })
          .then(
              (response) => {
                  response.json()
                      .then(
                          (success) => {
                              // tslint:disable-next-line:no-console
                              console.log(success[0].fileKey);
                              alert(success[0].fileKey);
                          })
                      .catch(
                          (error) => {
                              // tslint:disable-next-line:no-console
                              console.log(error);
                              alert('failed');
                          }
                      );
              });
    });
  }
}
const LoginSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Login);
LoginSwag.navigationOptions = {
  header: null
};
export default LoginSwag;
