const User = (props) => {
    const user = props.user;
    return ( <li> {user.nick} {user.email} </li> );
    }
    export default User