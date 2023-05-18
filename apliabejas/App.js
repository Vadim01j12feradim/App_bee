import { Dimensions } from 'react-native'
import Svg from 'react-native-svg'
import { Checkbox } from 'react-native-paper';

import React from 'react'

import { StatusBar } from 'expo-status-bar';
import { useState ,useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image,FlatList,TouchableHighlight ,SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import DatePicker from 'react-native-datepicker';

import { mdiBee } from '@mdi/js';
import { Form, FormItem } from 'react-native-form-component';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios'
import { mdiConsoleLine } from '@mdi/js/mdi';
import { Audio } from 'expo-av';
import { Dropdown } from 'react-native-element-dropdown';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { Animated ,DatePickerIOS} from 'react-native';
import FormData from 'form-data';
import { Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

// import Picker from '@react-native-picker/picker';

const MiVista = ({navigation,string}) => {
  const handleBackPress = () => {
    navigation.goBack(); // Utilizar el método goBack() para volver atrás en la navegación
  };
  return (
    <View style={{backgroundColor:"rgb(222, 185, 0)",padding:10,paddingTop:25,flexDirection: 'row',alignItems: 'center'}}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require('./Images/left.png')} style={{ marginRight: 10,width: 30, height: 30 }} /> 
        </TouchableOpacity>
        <Text style={{marginStart:"20%",fontSize:20}} >{string}</Text>
      </View>
  );
};


const { sizeWidth, sizeHeight } = Dimensions.get('window');

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function Sessions({route,navigation}){
  const { username } = route.params;
  console.log("username sesions",username);

  const [data,setData] = useState(null);
  let formData = new FormData(); 
  formData.append('name', username);

  const getData = async () => {
      await axios.post('https://izmabee.000webhostapp.com/controller/SesionListController.php',formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
          console.log(res.data);
          setData(res.data);
      }).catch(err => {
          alert("Error ",err.response);
      });
  };

  useEffect(() => {
   getData();
  }, []);
  
  const Item = ({ item }) => (
    
    <View style={styles.item}>
    {console.log("foto",'https://izmabee.000webhostapp.com/controller/sesionphotos/'+item.foto)} 
      <Card>
        <Card.Title><Text style={{fontSize:20}}>{item.descripcion}</Text></Card.Title>
        <Card.Divider/>
        <Card.Image source={{uri: 'https://izmabee.000webhostapp.com/controller/sesionphotos/'+item.foto}} style={{marginStart:40, width:250}} />
        <Text style={{marginBottom: 10, color:"black"}}>
          {item.latitude}, {item.longitud}
        </Text>
        <Button
         onPress={()=>navigation.navigate("TakeDetail",{
          id_sesion:item.id_sesion,
          username: username
         })}
         icon={
          <Icon
            name="mouse"
            size={15}
            color="white"
          />
        }
          buttonStyle={{ borderRadius: 0, marginLeft: 90, marginRight: 90, marginBottom: 0, borderRadius:20}}
          title=' View detail' />
      </Card>
    </View>
  );
  
  const renderItem = ({ item}) => (
    <Item item={item} />
  ); 


  return(
    
  <View style={{backgroundColor:"#E1FCFF"}}>
  <MiVista navigation={navigation} string={"View of sessions"}/>

   <TextInput
          placeholder='keyword..'
           label='Name'
            style={{width: 330,
            height: 40,
            padding: 10,
            borderWidth: 1,
            borderColor: 'black',
            marginBottom: 30,
            marginStart:30,
            marginTop:20,
            backgroundColor:"white",
            borderRadius: 20}}
        />
      
        <Button
              buttonStyle={{marginStart:80,marginEnd:80,height:50, borderRadius:20, backgroundColor:"#5bc0de",
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 3,

              }}
              icon={
                <Icon
                  name="add"
                  size={15}
                  color="white"
                />
              }
          
            title=" New Session"
            onPress={
              ()=>navigation.navigate('New',{})
            }
          />
  
  
      <FlatList
        
        data={data}
        renderItem={renderItem}
        keyExtractor={data => data.id_sesion}
      />
  </View>);
}


function Profile({route,navigation}) {
  const {nombre,last_name,sur_name,username,pwd,tipo} = route.params;
  const [password,setPass]=useState("")
  const [data,setData]=useState( [
    {id:1, page:"New",  title: username +" "+ last_name+" "+sur_name, color:"blue",  image:"https://cdn-icons-png.flaticon.com/512/10141/10141008.png"}]
    
)
let passBefore = pwd
let tipe = "Cuenta de usuario";
if(parseInt(tipo+"") == 1)
    tipe = "Administrador";

function changePasswordPress() {
  let newPWD = password.password+"";
  
  if (newPWD.split(" ").join("").length==0) {
    alert("The password "+newPWD+" is invalid")
    return ""
  }
  if (newPWD=="undefined" || newPWD==undefined) {
    newPWD = pwd;
    alert("Your password is: \""+newPWD+"\" not included \"")
    return ""
  }
  if (passBefore == newPWD) {
    alert("This password has used")
    return ""
  }
  //Chanhe a new password in the database because you have the new password

  axios.post('https://izmabee.000webhostapp.com/controller/UsuarioController.php',{
    OPC: 3,
    txtUsername: username+"",
    txtPwd: newPWD+""
  },{
    headers:{
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    }
      }).then(function (response){
          console.log("REQUEST IS: "+response.data);
          passBefore = newPWD;
          alert("\""+newPWD+"\" is your new password");
      }).catch(function (error) {
        console.log(error);
        alert("Has error ocurred: "+error);
    });
}


return(
  <View style={{textAlign:"center"}}>
    <MiVista navigation={navigation} string={"Profile information"}/>
    <FlatList style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={data}
        horizontal={false}
        numColumns={2}
        keyExtractor= {(item) => {
          return item.id;
        }}
        renderItem={({item}) => {
          return (
            <View onPress={()=>navigation.navigate(item.page,{username:username})}>
            <TouchableOpacity style={[styles.card, {backgroundColor:item.color}]}  onPress={()=>navigation.navigate(item.page,{username:username})}>
              <Image style={styles.cardImage} source={{uri:item.image}}/>
            </TouchableOpacity>

            <View style={styles.cardHeader}>
              <View style={{alignItems:"center", justifyContent:"center"}}>
                <Text style={{ fontSize: "17", fontWeight: 'bold' }} >{nombre} {last_name} {sur_name}</Text>
                <Text style={{ fontSize: "17", fontWeight: 'bold' }} >Username: {username}</Text>
                <Text style={{ fontSize: "17", fontWeight: 'bold' }} >Account type: {tipe}</Text>
                <Text style={{ fontSize: "17", fontWeight: 'bold' }} >Change your password</Text>
                <TextInput  
                    style={{height:"13%",marginVertical:"5%", borderRadius:"5%", width:"90%",textAlign:"center", fontSize: "17",color: 'rgb(255, 255, 255)', fontWeight: 'bold',backgroundColor:'black'}}
                    placeholder="Enter your new password..."
                    placeholderTextColor="rgb(215, 245, 172)"
                    underlineColorAndroid="white"
                    onChangeText={text => setPass({password:text})}/>
                <TouchableOpacity onPress={() => changePasswordPress() } 
                style={{ backgroundColor: '#FF5722', padding: 10, borderRadius: 5, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Change password</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
          )
        }}/>

  </View>
);
}

function Dashboard({route,navigation}){
  const [data,setData]=useState( [
      {id:0, page:"Graphics",  title: "Stats",      color:"rgb(5, 175, 82)", image:"https://cdn-icons-png.flaticon.com/512/495/495423.png"},
      {id:1, page:"New",  title: "New Session",      color:"#B622B5", image:"https://cdn-icons-png.flaticon.com/512/148/148764.png"},
      {id:2,page:"Sessions",  title: "Sessions",     color:"#FF4132", image:"https://cdn-icons-png.flaticon.com/512/7299/7299846.png"},
      {id:3,page:"Profile",  title: "Profile",     color:"#0397F6", image:"https://cdn-icons-png.flaticon.com/512/1077/1077012.png"} ,
      {id:4,page:"Settings",  title: "Settings",   color:"black", image:"https://cdn-icons-png.flaticon.com/512/561/561772.png"} ,
      {id:5, page:"Help", title: "Help",  color:"#FF9901", image:"https://cdn-icons-png.flaticon.com/512/189/189665.png"} ,
      {id:6, page:"About", title: "About",   color:"#04E1A0", image:"https://cdn-icons-png.flaticon.com/512/189/189664.png"} ,
      
       ]
      
) 
const handleBackPress = () => {
  navigation.goBack(); // Utilizar el método goBack() para volver atrás en la navegación
};

const {nombre,last_name,sur_name,username,pwd,tipo} = route.params;
  return(
    <View style={{marginTop:0}}>
      
      <MiVista navigation={navigation} string={"Menu of options"}/>
      
      <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={data}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <View onPress={()=>navigation.navigate(item.page,{nombre:nombre,last_name:last_name,sur_name:sur_name,username:username,pwd:pwd,tipo:tipo})}>
              <TouchableOpacity style={[styles.card, {backgroundColor:item.color}]}  onPress={()=>navigation.navigate(item.page,{nombre:nombre,last_name:last_name,sur_name:sur_name,username:username,pwd:pwd,tipo:tipo})}>
                <Image style={styles.cardImage} source={{uri:item.image}}/>
              </TouchableOpacity>

              <View style={styles.cardHeader}>
                <View style={{alignItems:"center", justifyContent:"center"}}>
                  <Text style={[styles.title, {color:item.color}]}  onPress={()=>navigation.navigate(item.page,{nombre:nombre,last_name:last_name,sur_name:sur_name,username:username,pwd:pwd,tipo:tipo})}>{item.title}</Text>
                </View>
              </View>
            </View>
            )
          }}/>


    </View>
  );
}

function Graphics({route,navigation}){
  const [image, setImage] = useState(null);
  const [observations, setObservations] = useState("");
  const {nombre,last_name,sur_name,username,pwd,tipo} = route.params;
  
  // Alert.alert(
  //   'Alert Title',
  //   nombre+" "+last_name+" "+sur_name+" "+username+" "+pwd+" "+tipo,
  //   [
  //     { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
  //   ],
  //   { cancelable: true }
  // );

  const [data,setData] = useState(null);
  let formData = new FormData(); 
  formData.append('name', username);
  formData.append('tipo',tipo)
  const getData = async () => {
      await axios.post('https://izmabee.000webhostapp.com/controller/SesionListController.php',formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
          console.log(res.data);
          setData(res.data);
      }).catch(err => {
          alert("Error ",err.response);
      });
  };

  // const labelsValues = []
// const dataValues = []

  // const [labelsValues, setLabelsValues] = useState(['12/12/2023', 'February', 'March', 'April', 'May', 'June']);
  const [linedata, setDataValues] = useState({
    labels: [0],
    datasets: [
      {
        data: [0],
        strokeWidth: 2, // optional
      },
    ],
  });

  
  

  let initialDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  let endDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const DatePickerExample = ({title}) => {
  const [date, setDate] = useState(new Date());

  return (
    <SafeAreaView style={[styles.container,{}]}>
      <View style={styles.container}>
        <Text style={[styles.title,{marginBottom:"-4%", textAlign:"center"}]}>
          {title} Date
        </Text>
        <DatePicker
            style={[styles.datePickerStyle,{color:"black"}]}
          date={date} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="select date"
          format="DD/MM/YYYY"
          minDate={"01/01/2000"}
          maxDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              // display: 'none',
              position: 'absolute',
              left: 0,
              top: 0,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 0,
            },dateText: { // Specify the color of the selected date
              color: 'black',
            },
            placeholderText: {
              color: 'gray',
            },
          }}
          onDateChange={(date) => {
            setDate(date);
            if (title == "Initial") {
              initialDate = date
            }
            else{
              endDate = date
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
  };


  const [selectedValue, setSelectedValue] = useState('');


  function getCountByProperty(arr, property, value) {
    const filteredItems = arr.filter(item => item[property] === value);
    return filteredItems.length;
  }
  function getUniquePropertyValues(arr, property) {
    const uniqueValues = new Set();
    arr.map(item => uniqueValues.add(item[property]));
    return Array.from(uniqueValues);
  }
  

  async function queryToGetDates(option) {
    
    //If is root question if by they or all
    // let option = 1; //0 for me 1 for all the option is available for the users root
    
    //alert("Initial: "+initialDate+ " End: "+endDate+" User: "+tipo+" Option: "+option*1);
    let formData = new FormData(); 
    formData.append('name', username);
    formData.append('min', initialDate);
    formData.append('max', endDate);
    formData.append('option', option*1);

    
    await axios.post('https://izmabee.000webhostapp.com/controller/SesionListController.php',formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
          // console.log("Grapics info: \n",res.data);
          console.log("Data: ",res.data)
          const labelV  = getUniquePropertyValues(res.data,"fecha")
          console.log("Unique dates: \n",labelV)
          
          const dataV= []
          for (let i = 0; i < labelV.length; i++) {
            // console.log("Act: "+labelValues[i])
            let count = getCountByProperty(res.data,"fecha",labelV[i])
            dataV.push(count)
          }
          console.log("Count: ",dataV)
          // alert(res.data)
          // option = res.data
          // setDataValues(labelV)
          // setLabelsValues(dataV)
          labelV.unshift(0)
          dataV.unshift(0)
          setDataValues({
            labels: labelV,//['12/12/2023', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                data: dataV,//[20, 100, 28, 80, 99, 49],
                strokeWidth: 2, // optional
              },
            ],
          })
          
      }).catch(err => {
          alert("Error ",err.response);
      });
  }

  

  const [checked, setChecked] = React.useState(false);

  const Check = ({title}) => {
    if (tipo == 0)
      return (
        <View style={{alignItems:"center"}}>
        <Text style={{marginBottom:"1%",fontWeight:"bold",fontSize:20}} >You're not super user</Text>
        </View>
      );
    else
    return (
      <Text style={{width:"10%"}}>
              <SafeAreaView style={{
        borderWidth:"1%",borderColor:"black",
        // width:"10%",
      alignItems: 'center',borderRadius:"100%",backgroundColor: checked ? 'green' : 'white'}}>
                <Checkbox

                    status={checked ? '1' : '0'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                    color={'green'}
                    uncheckColor={'red'}
                />
              </SafeAreaView>
      </Text>
    );
  }

  return (
    <View>
      <MiVista navigation={navigation} string={"Stats of sessions"}/>
    <Text style={{color:"green", textAlign:"center", fontSize:20, fontWeight:"Bold"}}>
      Stats of Sessions
    </Text>
    <ScrollView style={{backgroundColor:"white"}}>
    <View style={{alignItems:"center"}} >
      <DatePickerExample title={"Initial"}/>
      <DatePickerExample title={"End"}/>
     
     <View style={{alignItems:"center"}}>
     <Text style={{margin:"5%"}} >All users</Text>
     <Check ></Check>
     </View>
     
      

      <TouchableOpacity onPress={() => queryToGetDates(checked) } 
        style={{ marginHorizontal:"18%",marginTop:"6%" ,backgroundColor: 'green', padding: 10, borderRadius: 5, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2 }}>
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Apply changes</Text>
      </TouchableOpacity>
    </View>

    <LineChart
      data={linedata}
      width={Dimensions.get('window').width} //from react-native
      height={220}
      yAxisLabel={'🐝'}
      chartConfig={{
        backgroundColor: 'blue',
        backgroundGradientFrom: 'rgb(203, 206, 15)',
        backgroundGradientTo: 'green',
        decimalPlaces: 1, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 10,
        marginTop:"5%"
      }}
    />
    <Text style={{color:"green", padding:"15%", textAlign:"left", fontSize:20, fontWeight:"Bold"}}>
      Select option
    </Text>
    </ScrollView>
  </View>
  );
}



function New({route,navigation}){
  const [image, setImage] = useState(null);
  const [nombre, setNombre] = useState("");
  const [observations, setObservations] = useState("");
  const { username } = route.params;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);


    if (!result.canceled) {

      setImage(result.uri);
    }

    

  };

  const uploadData=async()=>{
    
    let filename = image.split('/').pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData(); 
    formData.append('OPC', "1");
    formData.append('name', nombre.nombre);
    formData.append('observations', observations.observations);
    formData.append('photo', { uri: image, name: filename, type });
    formData.append('username', username);
    
    await axios.post('https://izmabee.000webhostapp.com/controller/SesionController.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
        alert(res.data)
        if(res.data>0){
          alert("Session saved success ");
          navigation.navigate("Toma",{username:username,id_sesion:res.data})

        }
    }).catch(err => {
        console.log("Error:  ",err.response);
    });
  }

  return (
    
  <View style={{ backgroundColor:"white" }}>
    <MiVista navigation={navigation} string={"Take new Session"}/>
     <View style={{marginStart:15,marginTop:"10%"}}>
      
     </View>
     <View style={{marginStart:20,marginEnd:20}}>
     <Text style={{width: 200,
    height: 30,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:20,

    marginStart:-30,marginEnd:20,
    marginBottom: 10}}>Session name:</Text>
     <TextInput
           onChangeText={text => setNombre({nombre:text})}
           label='Name'
            style={{width: 330,
            height: 50,
            padding: 10,
            borderWidth: 1,
            borderColor: 'black',
            marginBottom: 30,
            borderRadius: 20}}
        />

<Text 
   
    style={{width: 200,
    height: 30,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:20,

    marginStart:-30,marginEnd:20,
    marginBottom: 10}}>Observations:</Text>

<TextInput
           onChangeText={text => setObservations({observations:text})}
          label='Name'
           style={{width: 330,
           height: 50,
           padding: 10,
           borderWidth: 1,
           borderColor: 'black',
           marginBottom: 30,
           borderRadius: 20}}
       />


      <Button
            icon={
              <Icon
                name="camera"
                size={15}
                color="white"
              />
            }
            onPress={pickImage}
            buttonStyle={{marginBottom:30,height:50, borderRadius:20}}
            title=" Upload picture"
          />


          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200,marginStart:70 }} />}      
      
          <Button
           onPress={uploadData}
            icon={
              <Icon
                name="save"
                size={15}
                color="white"
              />
            }
            buttonStyle={{marginBottom:30,height:50, borderRadius:20,marginTop:30}}
            title=" Save the session"
          />


    </View>
  </View>
  );
}

const position = new Animated.ValueXY({x:300,y:800});
  Animated.timing(position,{
    toValue:{x:-250,y:-70},
    duration:19000,
    useNativeDriver: false
  }).start()

const StackNav = createStackNavigator();



 function Login({route,navigation}) {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  function login(){
    
    axios.post('https://izmabee.000webhostapp.com/controller/UsuarioController.php', { 
            OPC: 2,
            txtUsername: email.email+"",
            txtPwd: password.password+""
      },{
        headers:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
      })
    .then(function (response) {
      
        let dt = response.data+""
        if(dt!="false"){

          // alert("Welcome "+email.email)
          dt = response.data
          alert("Welcome "+dt.nombre+" "+dt.last_name+" "+dt.sur_name)

          // navigation.navigate('Dashboard',{username:email.email})
          navigation.navigate('Dashboard',{nombre:dt.nombre,last_name:dt.last_name,sur_name:dt.sur_name,username:dt.username,pwd:dt.pwd,tipo:dt.tipo})

        }else{
          alert("user "+email.email+" not found, please verify the fields NOW",response.data)
        }
        
    })
    .catch(function (error) {
        console.log(error);
    });
  }  
  return (
    <View style={styles.container}>

    <Animated.View style={{
          transform:[
            {translateX:position.x},
            {translateY:position.y}
          ]
          }}>
            <Image  style={styles.bee} source={require('./Images/icon2.gif')} />
    </Animated.View>
  
     <Image  style={
      {width:150,height:150,marginBottom:30}
      } source={require('./Images/logo2.png')}/>
  
  <View style={[styles.camps,{width: sizeWidth, height: sizeHeight}]}>
      <Text style={{fontSize:40,marginBottom:20}}>Bee App Recorder</Text>
      <View style={[styles.inputView,{width:300}]} >
        <TextInput  
          style={styles.inputText}
          placeholder="Username..." 
          placeholderTextColor="white"
          underlineColorAndroid="white"
          onChangeText={text => setEmail({email:text})}/>
      </View>
      <View style={[styles.inputView,{width:300}]}>
        <TextInput  
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..." 
          placeholderTextColor="white"
          onChangeText={text => setPassword({password:text})}/>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={
        ()=>login()
      }>
        <Text style={[styles.loginText,{width:120,height:40}]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={
        ()=>navigation.navigate('Signup')
      }>
        <Text style = {[styles.loginText,{width:120,height:40}]} >SIGNUP</Text>
      </TouchableOpacity>

      </View>
  </View>
  );
}


function Signup({navigation}) {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [reppassword,setReppassword]=useState("")
  const [name,setName]=useState("")
  const [lastName,setLastName]=useState("")
  const [surName,setSurName]=useState("")
  const [desabilitado,setDesabilitado] = useState(false)

  function register(){
    //setDesabilitado(true)
  
    if((email.email == undefined || email == "") || password.password==undefined || name.name==undefined || lastName.lastName ==undefined || surName.surName==undefined){
      alert("complet all fields")
    }else{
        // axios.post('https://izmabee.000webhostapp.com/controller/UsuarioController.php', { 
           axios.post('https://izmabee.000webhostapp.com/controller/UsuarioController.php', { 
                OPC: 1,
                txtUsername: email.email+"",
                txtPwd: password.password+"",
                txtName: name.name+"",
                txtLastName: lastName.lastName+"",
                txtSurName: surName.surName+""
          },{
            
        headers:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
          })
        .then(function (response) {
          console.log("data ",response.data)
            if(response.data == true || response.data=="true"){
              setDesabilitado(false)
              alert("Registered user successfully")
              navigation.navigate('Login')
            }else{
              alert("This user already exist")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
  }

  return (
    <ScrollView>
      <MiVista navigation={navigation} string={"View of accounts"}/>
    <View style={styles.container}>
     
    <Text style={{fontSize:20,marginTop:30, marginHorizontal:"1%",paddingBottom:40}}>New user, please complete the information below</Text>
    <View style={styles.inputView} >
      <TextInput  
        style={styles.inputText}
        placeholder="Email..." 
        placeholderTextColor="white"
        underlineColorAndroid="white"
        onChangeText={text => setEmail({email:text})}/>
    </View>
    
    <View style={styles.inputView} >
      <TextInput  
        secureTextEntry
        style={styles.inputText}
        placeholder="Password..." 
        placeholderTextColor="white"
        onChangeText={text => setPassword({password:text})}/>
    </View>

    <View style={styles.inputView} >
      <TextInput  
        secureTextEntry
        style={styles.inputText}
        placeholder="Repeat the password..." 
        placeholderTextColor="white"
       />
    </View>

    <View style={styles.inputView} >
      <TextInput  
        
        style={styles.inputText}
        placeholder="Name..." 
        placeholderTextColor="white"
        onChangeText={text => setName({name:text})}/>
    </View>

    <View style={styles.inputView} >
      <TextInput  
        
        style={styles.inputText}
        placeholder="Last name..." 
        placeholderTextColor="white"
        onChangeText={text => setLastName({lastName:text})}/>
    </View>

    <View style={styles.inputView} >
      <TextInput  
        
        style={styles.inputText}
        placeholder="Sur name..." 
        placeholderTextColor="white"
        onChangeText={text => setSurName({surName:text})}/>
    </View>


    
    <TouchableOpacity  disabled={desabilitado}
    style={styles.loginBtn} onPress={
      ()=>register()
    }>
      <Text style={styles.loginText}>Register now</Text>
    </TouchableOpacity>
  


  </View>
  </ScrollView>
  );
}

const Separator = () => <View style={styles.separator} />

function Toma({route,navigation}) {
  const data = [
    { label: 'Microphone Cell', value: '1' },
    { label: 'Lavalier Mic', value: '2' },
    
  ];
  const { username , id_sesion} = route.params;

  const [recording, setRecording] = useState();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [statusRec, setStatusRec] = useState(null)
  const [click,setClick] = useState(false);
  const [uri,setUri] = useState("");
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: recording, status} = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY,
        
        
        
        );
      console.log("estatus ",status)
      console.log("recordiing",recording)
      setStatusRec(status)
      setRecording(recording);
      console.log('Recording started');
      
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {

    
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        

      


  }

  async function send(){
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        const filetype = uri.split(".").pop();
        let filename = recording.getURI().split('/').pop();

        let type = `audio`;

        let formData = new FormData(); 
        formData.append('OPC', "1");
        formData.append('id_sesion', id_sesion);
        // formData.append('fecha', '2021-02-02');
        // const currentDate = new Date();

// Get year, month, and day from the current date
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1 and pad with leading zeros
        const day = String(currentDate.getDate()).padStart(2, '0'); // Pad day with leading zeros

        // Format date in "YYYY-MM-DD" format
        const formattedDate = `${year}-${month}-${day}`;

        formData.append('fecha', formattedDate);
        formData.append('audio', { uri: recording.getURI(), name: filename, type: `audio/${filetype}` });
        formData.append('username', username);
        formData.append('metodo', 1);
        console.log("FORMULARIO",formData);
        setUri(recording.getURI());
        //alert("sending")
        await axios.post('https://izmabee.000webhostapp.com/controller/TomaController.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => {
          
          console.log("The data is: "+res.data);
          if(res.data>0){
            alert("Take is saved, thank you!");
          }
        }).catch(err => {
            console.log("Error ",err.response);
        });
        
  }

  async function reproducir(){
          // alert("PLaying audio"+uri)
           const sound = new Audio.Sound()

          await sound.loadAsync({
              uri: uri
          })

          await sound.playAsync()
  }
  function enviar(){
    if(recording){
      stopRecording();
      send();
    }else{ 
      startRecording();
    }
  }


  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90000);
  const [resetTimer, setResetTimer] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);


  return (
    <View>
    <MiVista navigation={navigation} string={"View of sessions"}/>
    <View style={{margin:10}}>
    
        <Text style={{fontSize:20}}>
          Select the next option, before to click start recording button, when finished press the button send
        </Text>
      <Text style={{fontSize:20, marginTop:30}}>
          Select the method record: 
        </Text>
       
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          
          maxHeight={300}
          labelField="label"
          valueField="value"
          
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
      
        />
   <Separator />
      <Button
        style={{marginTop:20}}
        title={recording ? 'the take is being recorded' : 'Start Recording'}
        disabled={uri!="" ? true : false}
        onPress={()=>startRecording()}
      />
   <Separator />
<Button
        style={{marginTop:20}}
        title={ 'New Take'}
        disabled={uri=="" ? true : false}
        onPress={()=>startRecording()}
      />

      

    
<Separator />

<SafeAreaView style={{marginTop:50}}>
            <View>
                <View  style={{marginStart:70}}>
                    <Stopwatch
                        laps
                        msecs
                        start={recording}
                        reset={resetStopwatch}
                        options={options}
                        getTime={(time) => {
                            console.log(time);
                          
                        }}
                       
                    />
                   
                    
                </View>
                
            </View>
        </SafeAreaView>

        <Separator />

        <Button
        style={{marginTop:20}}
        disabled={uri=="" ? true : false}
        title={"Play"}
        onPress={()=>reproducir()}
      />

<Separator />

        <Button
        style={{marginTop:20}}
        disabled={recording ? false : true}
        title={"Stop and Send"}
        onPress={()=>enviar()}
      />

<Separator />
      <Button
        style={{marginTop:20}}
        disabled={uri=="" ? true : false}
        title={"Back to the sessions"}
        onPress={()=>navigation.goBack()}
      />
      </View>
    </View>
  );
}



function Take({route,navigation}) {
  
  const { username , id_sesion} = route.params;
  // const [data,setData] = useState(null);
  const getData = async () => {
    await axios.post('https://izmabee.000webhostapp.com/controller/SesionListController.php?username='+username, {}, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
        console.log(res.data)
        setData(res.data);
    }).catch(err => {
        console.log("Error ",err.response);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  
  const data = [
    { label: 'Microphone Cell', value: '1' },
    { label: 'Lavalier Mic', value: '2' },
    
  ];

  const [recording, setRecording] = useState();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [statusRec, setStatusRec] = useState(null)
  const [click,setClick] = useState(false);
  const [uri,setUri] = useState("");
  

  async function stopRecording() {

    
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        

      


  }

  
  async function reproducir(){
           const sound = new Audio.Sound()

          await sound.loadAsync({
              uri: uri
          })

          await sound.playAsync()
  }
  function enviar(){
    if(recording){
      stopRecording();
      send();
    }else{ 
      startRecording();
    }
  }

  const [resetStopwatch, setResetStopwatch] = useState(false);


  return (
    <View style={{marginTop:60, padding:20}}>
        <Text style={{fontSize:20}}>
          Session Detail
        </Text>
      <Text style={{fontSize:20, marginTop:30}}>
          Select the method record: 
        </Text>
       
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          
          maxHeight={300}
          labelField="label"
          valueField="value"
          
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
      
        />
   <Separator />
      <Button
        style={{marginTop:20}}
        title={recording ? 'the take is being recorded' : 'Start Recording'}
        disabled={uri!="" ? true : false}
        onPress={()=>startRecording()}
      />
   <Separator />
<Button
        style={{marginTop:20}}
        title={ 'New Take'}
        disabled={uri=="" ? true : false}
        onPress={()=>startRecording()}
      />

      

    
<Separator />

<SafeAreaView style={{marginTop:50}}>
            <View>
                <View  style={{marginStart:70}}>
                    <Stopwatch
                        laps
                        msecs
                        start={recording}
                        reset={resetStopwatch}
                        options={options}
                        getTime={(time) => {
                            console.log(time);
                          
                        }}
                       
                    />
                   
                    
                </View>
                
            </View>
        </SafeAreaView>

        <Separator />

        <Button
        style={{marginTop:20}}
        disabled={uri=="" ? true : false}
        title={"Play"}
        onPress={()=>reproducir()}
      />

<Separator />

        <Button
        style={{marginTop:20}}
        disabled={recording ? false : true}
        title={"Stop and Send"}
        onPress={()=>enviar()}
      />

<Separator />
      <Button
        style={{marginTop:20}}
        disabled={uri=="" ? true : false}
        title={"Back to the sessions"}
        onPress={()=>goBack()}
      />

    </View>
  );
}


function TakeDetail({route,navigation}) {
  
  const { username , id_sesion} = route.params;
  console.log("**\nusername ",username);
  console.log("id_sesion ",id_sesion);

  let formData = new FormData(); 
  formData.append('name', username);
  formData.append('id_sesion', id_sesion);

  const [data, setData] = useState("");

  const getData = async () => {
    await axios.post('https://izmabee.000webhostapp.com/controller/SesionListController.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {

        console.log("Query: "+res.data)
        // console.log("foto: "+res.data.foto)
        setData(res.data);
    }).catch(err => {
        console.log("Error->",err.response);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  


  const [recording, setRecording] = useState();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [statusRec, setStatusRec] = useState(null)
  const [click,setClick] = useState(false);
  const [uri,setUri] = useState("");
  

  async function stopRecording() {

        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        
  }

  
  async function reproducir(){
           const sound = new Audio.Sound()

          await sound.loadAsync({
              uri: uri
          })

          await sound.playAsync()
  }
  function enviar(){
    if(recording){
      stopRecording();
      send();
    }else{ 
      startRecording();
    }
  }

  const [resetStopwatch, setResetStopwatch] = useState(false);



  return (
    <View>
    <MiVista navigation={navigation} string={"View of sessions"}/>
    <View style={{marginTop:20, padding:10}}>

        <Text style={{fontSize:20, textAlign:"center", alignItems:"center", alignContent:"center"}}>
          
        <Card>
        <Card.Title><Text style={{fontSize:20}}>Session Details{'\n\t\t'}</Text></Card.Title>
        <Card.Divider/>
        <Card.Image source={{uri: 'https://izmabee.000webhostapp.com/controller/sesionphotos/'+data.foto}} style={{marginStart:10, width:250}} />
        <Text style={{marginBottom: 2, color:"black", padding:8}}>
          User name: {data.name}{'\n'}
          Location: {data.latitude}, {data.longitud}{'\n'}
          Description: {data.descripcion}
        </Text>
 
      </Card>
  
        </Text>
      <Text style={{fontSize:20, marginTop:30}}>
          Select the method record: 
      </Text>
       
        
   <Separator />
     
<Button
        style={{marginTop:20}}
        title={ 'New Take'}
        disabled={uri!="" ? true : false}
        onPress={()=>navigation.navigate("Toma",{
          id_sesion:id_sesion,
          username: username
         })}
      />

      

    
<Separator />

<SafeAreaView style={{marginTop:50}}>
            <View>
                <View  style={{marginStart:70}}>
                    <Stopwatch
                        laps
                        msecs
                        start={recording}
                        reset={resetStopwatch}
                        options={options}
                        getTime={(time) => {
                            console.log(time);
                          
                        }}
                       
                    />
                </View>
                
            </View>
        </SafeAreaView>

        <Separator />

        <Button
        style={{marginTop:20}}
        disabled={uri=="" ? true : false}
        title={"Play"}
        onPress={()=>reproducir()}
      />

<Separator />
        <Button
        style={{marginTop:20}}
        disabled={recording ? false : true}
        title={"Stop and Send"}
        onPress={()=>enviar()}
      />
    </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator  screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Graphics" component={Graphics} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Sessions" component={Sessions} />
        <Stack.Screen name="Take" component={Take} />
        <Stack.Screen name="TakeDetail" component={TakeDetail} />
        <Stack.Screen name="New" component={New} />
        <Stack.Screen name="Toma" component={Toma} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  result:{
    fontSize: 16,
    marginTop: 10,
  },
  picker:{
    width: '80%',
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
  bee: {width: 50,
    height: 50},
  camps: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    // width: 500,
    // height: 500,
    padding: 10,
    borderWidth: 9,
    borderColor: 'rgb(255, 244, 145)',
    marginBottom: 10,
    backgroundColor: "rgba(255, 244, 145, 0.404)",
    borderRadius: 20,
    shadowOffset: { width: 70, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'red',
    elevation: 0,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inpuText: {
    width: 200,
    height: 44,
    padding: 5,
    textAlign:'center',
    fontWeight:'bold',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    color:'white'
  },
  
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"90%",
    backgroundColor:"gray",
    borderRadius:25,
    // height:"12%",
    marginBottom:20,
    justifyContent:"center",
    padding:12,
    color:"white"
  },
  forgot:{
    color:"black",
    fontSize:13
  },
  loginBtn:{
    // width:"80%",
    backgroundColor:"#42ba96",
    shadowColor:"black",
    borderRadius:25,
    // height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    padding: "3%",
    color:"black",
    textAlign:'center',
    fontSize:20,
    fontSize:24
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#fff",
  },
  listContainer:{
    alignItems:'center'
  },
  /******** card **************/
  card:{
    shadowColor: '#474747',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    backgroundColor:"#e2e2e2",
    //flexBasis: '42%',
    width:100,
    height:120,
    borderRadius:0,
    alignItems:'center',
    justifyContent:'center'
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage:{
    height: 50,
    width: 50,
    alignSelf:'center'
  },
  title:{
    fontSize:24,
    flex:1,
    alignSelf:'center',
    fontWeight:'thin'
  },
  dropdown: {
    marginTop:20,
    height: 50,
    width:300,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
},
sectionStyle: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonText: {
    fontSize: 20,
    marginTop: 10,
},
separator: {
  marginVertical: 8,
  borderBottomColor: '#737373',
  borderBottomWidth: StyleSheet.hairlineWidth,
},
});

const options = {
  container: {
      backgroundColor: '#FF0000',
      padding: 5,
      borderRadius: 5,
      width: 200,
      alignItems: 'center',
  },
  text: {
      fontSize: 25,
      color: '#FFF',
      marginLeft: 7,
  },
};
