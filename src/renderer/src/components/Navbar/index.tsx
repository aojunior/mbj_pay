import { Container, Link } from "./style";
import { useNavigate } from 'react-router-dom'

// const navigate = (route: string) => {
//     (window as any).api.navigate(route);
// };

export function Navbar() {
    const navigate = useNavigate()

    return (
        <Container>
            <ul style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'center'}}>
                <li><Link onClick={() => navigate('/')}>Home</Link></li>
                <li><Link onClick={() => navigate('/dashboard')}>Dashboard</Link></li>
                <li><Link onClick={() => navigate('/createaccount')}>New Account</Link></li>
                <li><Link onClick={() => navigate('/settings')}>Settings</Link></li>
            </ul>
        </Container>
    )
}