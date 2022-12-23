import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from './store'

export const useReduxState = () => {
    return useSelector((state: RootState) => state)
}

export const useReduxDispatch = () => useDispatch<Dispatch>()
