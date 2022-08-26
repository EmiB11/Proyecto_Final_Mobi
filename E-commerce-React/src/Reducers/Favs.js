const initialState = {
    detailFavs: [],
    myFavs: []
}

export default function favReducer (state= initialState, action){
    switch(action.type){
        case 'GET_ALL_FAVS': return {
            ...state,
            myFavs: action.payload
        }
        case 'POST_FAV': return{
            ...state,
            detailFavs: action.payload
        }
        case 'DELETE_FAV':
        const filterFav = state.myFavs.filter(el => el.id !== action.payload)
        return{
            ...state,
            myFavs: filterFav

        }
        default: return{...state}
    }

}