import {createSlice} from '@reduxjs/toolkit'

    const initialState={
        _id:'',
        email:'',
        username:'',
        auth:false
    }



export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            	// the data coming from api would be fetched through action.payload

			const {_id,email,username,auth}=action.payload;

            // then we save the state
        
                    state._id=_id;
                    state.email=email;
                    state.username=username;
                    state.auth=auth;
        },
        resetUser:(state)=>{
            state._id='';
            state.email='';
            state.username='';
            state.auth=false
        }
    }
});

//now we export our actions and then reducers
export const {setUser,resetUser} = userSlice.actions;
export default userSlice.reducer; 