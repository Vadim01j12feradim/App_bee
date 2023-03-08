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



const Stack = createNativeStackNavigator();


const Tab = createBottomTabNavigator();


function Sessions({route,navigation}){
  const { username } = route.params;
  console.log("username sesions",username);

  const [data,setData] = useState(null);
  const getData = async () => {
      await axios.post('https://beeapps.000webhostapp.com/controller/SesionListController.php?username='+username, {}, {
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

  
  const Item = ({ item }) => (
    
    <View style={styles.item}>
    {console.log("foto",'https://beeapps.000webhostapp.com/controller/sesionphotos/'+item.foto)} 
      <Card>
        <Card.Title><Text style={{fontSize:20}}>{item.descripcion}</Text></Card.Title>
        <Card.Divider/>
        <Card.Image source={{uri: 'https://beeapps.000webhostapp.com/controller/sesionphotos/'+item.foto}} style={{marginStart:40, width:250}} />
        <Text style={{marginBottom: 10, fontFamily:"Arial"}}>
           834838N,  34455N
        </Text>
        <Button

         onPress={()=>navigation.navigate("TakeDetail",{
          id_sesion:item.id_sesion
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
  <View style={{marginTop:60,paddingTop:20, backgroundColor:"#E1FCFF"}}>


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
              ()=>navigation.navigate('New')
            }
          />
  
  
      <FlatList
        
        data={data}
        renderItem={renderItem}
        keyExtractor={data => data.id_sesion}
      />
  </View>);
}


function Dashboard({route,navigation}){
  const [data,setData]=useState( [
      {id:1, page:"New",  title: "New Session",      color:"#B622B5", image:"https://cdn-icons-png.flaticon.com/512/148/148764.png"},
      {id:2,page:"Sessions",  title: "Sessions",     color:"#FF4132", image:"https://cdn-icons-png.flaticon.com/512/7299/7299846.png"},
      {id:3,page:"Profile",  title: "Profile",     color:"#0397F6", image:"https://cdn-icons-png.flaticon.com/512/1077/1077012.png"} ,
      {id:4,page:"Settings",  title: "Settings",   color:"black", image:"https://cdn-icons-png.flaticon.com/512/561/561772.png"} ,
      {id:5, page:"Help", title: "Help",  color:"#FF9901", image:"https://cdn-icons-png.flaticon.com/512/189/189665.png"} ,
      {id:6, page:"About", title: "About",   color:"#04E1A0", image:"https://cdn-icons-png.flaticon.com/512/189/189664.png"} ,
       ]
      
) 
const { username } = route.params;
  return(
    <View style={{marginTop:60}}>

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
                  <Text style={[styles.title, {color:item.color}]}  onPress={()=>navigation.navigate(item.page,{username:username})}>{item.title}</Text>
                </View>
              </View>
            </View>
            )
          }}/>


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

    await axios.post('https://beeapps.000webhostapp.com/controller/SesionController.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
      
        if(res.data>0){
          alert("Session saved success ");
          navigation.navigate("Toma",{username:username,id_sesion:res.data})

        }
    }).catch(err => {
        console.log("Error ",err.response);
    });
  }

  return (
  <View style={{marginTop:60, backgroundColor:"white" }}>
     <View style={{marginStart:15}}>
      
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


const StackNav = createStackNavigator();




 function Login({route,navigation}) {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  function login(){

    //alert("Welcome")
    //navigation.navigate('Dashboard',{username:'adrielpalestino'})
    
    axios.post('https://beeapps.000webhostapp.com/controller/UsuarioController.php', { 
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
      console.log("data ",response.data)
        if(response.data == true || response.data=="true"){
          alert("Welcome")
          navigation.navigate('Dashboard',{username:email.email})

        }else{
          alert("user not found, please verify the fields")
        }
        
    })
    .catch(function (error) {
        console.log(error);
    });
  
  }
  return (
    <View style={styles.container}>
     <Image  style={{width: 250,
    height: 250}} source={require('./Images/logo2.png')} />
    <Text style={{fontSize:40}}>Bee App Recorder</Text>
    <View style={styles.inputView} >
      <TextInput  
        style={styles.inputText}
        placeholder="User..." 
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
    <TouchableOpacity>
      <Text style={styles.forgot}>Forgot Password?</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.loginBtn} onPress={
      ()=>login()
    }>
      <Text style={styles.loginText}>LOGIN</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.loginBtn} onPress={
      ()=>navigation.navigate('Signup')
    }>
      <Text >SIGNUP</Text>
    </TouchableOpacity>


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
    setDesabilitado(true)
  
    if((email.email == undefined || email == "") || password.password==undefined || name.name==undefined || lastName.lastName ==undefined || surName.surName==undefined){
      alert("complet all fields")
    }else{
        axios.post('https://beeapps.000webhostapp.com/controller/UsuarioController.php', { 
                OPC: 1,
                txtUsername: email.email+"",
                txtPwd: password.password+"",
                txtName: name.name+"",
                txtLastName: lastName.lastName+"",
                txtSurName: surName.surName+""
          },{
            
          })
        .then(function (response) {
            if(response.data == true || response.data=="true"){
              setDesabilitado(false)
              alert("Registered user successfully")
              navigation.navigate('Login')

            }
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }
  }

  return (
    <ScrollView>
    <View style={styles.container}>
     
    <Text style={{fontSize:20,marginTop:100,paddingBottom:40}}>New user, please complete the information below</Text>
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
        formData.append('fecha', '2021-02-02');
        formData.append('audio', { uri: recording.getURI(), name: filename, type: `audio/${filetype}` });
        formData.append('username', username);
        formData.append('metodo', 1);
        console.log("FORMULARIO",formData);
        setUri(recording.getURI());

        await axios.post('https://beeapps.000webhostapp.com/controller/TomaController.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => {
          
          console.log(res.data);
          if(res.data>0){
            alert("Take is saved, thank you!");
          }
        }).catch(err => {
            console.log("Error ",err.response);
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


  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90000);
  const [resetTimer, setResetTimer] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);


  return (
    <View style={{marginTop:60, padding:20}}>

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
        onPress={()=>goBack()}
      />

    </View>
  );
}

function Take({route,navigation}) {
  
  const { username , id_sesion} = route.params;
  
  const getData = async () => {
    await axios.post('https://beeapps.000webhostapp.com/controller/SesionListController.php?username='+username, {}, {
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
  console.log("username ",username);
  console.log("id_sesion ",id_sesion);
  const getData = async () => {
    await axios.post('https://beeapps.000webhostapp.com/controller/SesionListController.php?username='+username, {}, {
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
    backgroundColor: 'white',
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
    width:"80%",
    backgroundColor:"gray",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#42ba96",
    shadowColor:"black",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"black",
    fontSize:20
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
