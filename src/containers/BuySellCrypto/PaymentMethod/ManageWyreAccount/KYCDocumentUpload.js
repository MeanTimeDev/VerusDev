import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  Text,
  StyleSheet,

} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';
import {
  FormLabel,
  FormValidationMessage
} from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';

import {Button, Badge,  CheckBox } from 'react-native-elements';

import {
  selectWyreAccountField,
  selectWyrePutAccountIsFetching,
} from '../../../../selectors/paymentMethods';

import {
  uploadWyreAccountDocument
} from '../../../../actions/actions/PaymentMethod/WyreAccount';

import PrimeTrustInterface from '../../../../utils/PrimeTrust/provider';

import Styles from '../../../../styles/index';
import Colors from '../../../../globals/colors';
import { FlatList } from 'react-native-gesture-handler';

const formatURI = (uri) => (
  Platform.OS === 'android' ? uri : uri.replace('file://', '')
);

//temporary code
const styles = StyleSheet.create({
  logo: {
    width: 66,
    height: 58,
  },
});

let doesContainAddress = false;


class KYCDocumentUpload extends Component {
  constructor(props) {
    super(props);
    //check the id type that is being processed
    //console.log(this.props);
    //this.state.documentType = props.route.params.documentType;
    //this.state.hasAddress = props.route.params.includeAddress;
    this.state = {
      image: null,
      error: null,
      documents: [],
      isFetching: true,
      documentType : this.props.route.params.documentType,
      hasAddress : this.props.route.params.includeAddress,
      completeDocuments : false
    };

    switch(this.props.route.params.documentType) {
      case "Drivers License":
        this.state.currentDocument = "Front of Drivers License"
        break;
      case "Identity Card":
        this.state.currentDocument = "Front of Identity Card"
        break;
      default :
        this.state.currentDocument = "Passport Photo Page"  
    }


    if(PrimeTrustInterface.user === null) {
      //redirect to  the  login page
      console.log("redirecting to login page:");
      this.props.navigation.navigate("KYCStart");
    }
    //load docs
    //this.getUploadedDocuments();
    this.getContacts();
    
  }

  handleSelect = async () => {
    Keyboard.dismiss();
    this.isFetch = true;
    ImagePicker.showImagePicker((response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else if (response.type !== 'image/jpeg') {
        Alert.alert('Please select image in jpeg format');
      } else {
        this.setState({
          image: response,
        });
      }

      //upload the image to primeTrust
      let document = await PrimeTrustInterface.sendDocument(contact.id,
        this.state.documentType,
        this.state.image);
      if(document.success){

        //store the document
        let tempDocuments = this.state.documents;
        tempDocuments.push({
          type:this.state.currentDocument,
          document:document.data.data
        });
        this.setState({documents: tempDocuments});

        //set the next required document and store the document in the state
       switch(this.state.currentDocument) {
         case "Front of Drivers License" :
           this.setState({currentDocument : "Back of Drivers License"});
           break;
         case "Back of Drivers License" :
            if(this.state.hasAddress) {
              this.setState({completeDocuments : true});
            } else {
              this.setState({currentDocument : "Proof of Address Document"});
            }
            break;
         case "Front of Identity Card" :
            this.setState({currentDocument : "Back of Drivers License"});
            break;
         case "Back of Identity Card" :
              if(this.state.hasAddress) {
                this.setState({completeDocuments : true});
              } else {
                this.setState({currentDocument : "Proof of Address Document"});
              }
              break;
         case "Proof of Address Document" :
          this.setState({completeDocuments : true});
           break;  
       } 
                
      } else {
        let message = document.error[0].source.pointer + document.error[0].detail;
        Alert.alert("There was a problem with your image", message );
      }
      this.isFetching = false;
    });
  };

  getUploadedDocuments = () => {
    this.isFetching = true;
    PrimeTrustInterface.getUploadedDocuments().then((retrievedDocuments) => {
      this.setState({documents : retrievedDocuments.data.data});  
      this.setState({isFetching : false});
    });
  }

  getContacts = () => {
    PrimeTrustInterface.getContacts().then((contacts) => {
      let contact = contacts.data.data[0];
      this.setState({contact: contact});
    })
  }

  clearSelectedImage = () => {
    this.setState({
      image: null
    });
  }

  handleUpload = async () => {

    //console.log(this.state);
    let contacts = await PrimeTrustInterface.getContacts();
    
    if(contacts.data.data[0] == undefined){
      console.log("no contact");
    } else {
      console.log("state:",this.state.image);
      let contact = contacts.data.data[0];
      let document = await PrimeTrustInterface.sendDocument(contact.id,
        this.state.documentType,
        this.state.image);
      if(document.success){
        //document successfuly uploaded reset the page

        //check if there are now the correct number of documents
        this.clearSelectedImage();
      } else {
        let message = document.error[0].source.pointer + document.error[0].detail;
        Alert.alert("There was a problem with your image", message );
      }

    }
  };

  render() {
    const scaleFactorY = 2;
    const scalefatorX = 2;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={Styles.root}>
        <View style={Styles.centralRow}>
          <Badge
            status="success"
            badgeStyle={ {scaleX: scalefatorX, scaleY: scaleFactorY } }
            containerStyle={Styles.horizontalPaddingBox10}
          />
          <Badge
            status="success"
            badgeStyle={ {scaleX: scalefatorX, scaleY: scaleFactorY } }
            containerStyle={Styles.horizontalPaddingBox10}
          />
          <Badge
            status="primary"
            badgeStyle={ {scaleX: scalefatorX, scaleY: scaleFactorY } }
            containerStyle={Styles.horizontalPaddingBox10}
          />
          <Badge
            status="primary"
            badgeStyle={ {scaleX: scalefatorX, scaleY: scaleFactorY } }
            containerStyle={Styles.horizontalPaddingBox10}
          />
        </View>
          <View style={styles.mainInputView}>
            <Spinner
              visible={this.state.isFetching}
              textContent="Loading..."
              textStyle={{ color: '#FFF' }}
            />

            {!this.state.allDocuments && (
              <View>  
                <View style={styles.buttonContainerBottom}>
                  <Button
                  titleStyle={Styles.whiteText}
                  buttonStyle={Styles.defaultButtonClearWhite}
                    title={this.state.currentDocument}
                    onPress={this.handleSelect}
                  />
                </View>
              </View>
            )}

            {this.state.allDocuments && (
            <View>
              <View>
                <FlatList data={this.state.documents} renderItem={({item}) => 
                <View><Text>{item.attributes.label}</Text>
                <Image style={styles.logo} source={{uri: item.attributes["file-url"]}}/>
                </View>} />
              </View>

                <View>

                  <View style={styles.buttonContainer}>
                    <Button
                    titleStyle={Styles.whiteText}
                    buttonStyle={Styles.defaultButtonClearWhite}
                      title="CONFIRM AND SUBMIT"
                      onPress={this.handleUpload}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <Button
          titleStyle={Styles.whiteText}
          buttonStyle={Styles.defaultButtonClearWhite}
            title="CHEAT TO NEXT SCREEN"
            onPress={()=>{
              this.props.navigation.navigate("KYCAddressInfo")
            }
            }
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: selectWyrePutAccountIsFetching(state),
  field: selectWyreAccountField(state, 'individualGovernmentId'),
  fieldId: 'individualGovernmentId',
});

const mapDispatchToProps = ({
  uploadWyreAccountDocument,
});

export default connect(mapStateToProps, mapDispatchToProps)(KYCDocumentUpload);

export {
  KYCDocumentUpload
}


