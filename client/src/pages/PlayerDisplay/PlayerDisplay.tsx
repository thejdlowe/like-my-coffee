import { useParams } from 'react-router';

export const PlayerDisplay = () => {
    const {id} = useParams();
    if(!id) return(<></>);
    return (<>{id}</>)
}