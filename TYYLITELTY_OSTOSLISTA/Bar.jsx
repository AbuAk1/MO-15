import React from 'react'
import { Appbar} from "react-native-paper";

function Bar() {
  return (
    
      <Appbar.Header  >
        <Appbar.Content
        style={{ backgroundColor:"blue",alignSelf:"stretch"}} 
          titleStyle={{ color: "white", textAlign: "center"}}
          title="Shopping List"
          mode="large" />
      </Appbar.Header>
      
  )
}

export default Bar