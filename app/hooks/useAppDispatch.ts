import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/createStore';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default useAppDispatch;
