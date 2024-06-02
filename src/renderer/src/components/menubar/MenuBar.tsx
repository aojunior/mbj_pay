import { Container } from "./style";

const navigate = (route: string) => {
    (window as any).api.navigate(route);
};

export function MenuBar() {
    return (
        <Container>
            <ul style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                <li><button onClick={() => navigate('/')}>Go to Home</button></li>
                <li><button onClick={() => navigate('/dashboard')}>Go to Dashboard</button></li>
                <li><button onClick={() => navigate('/createaccount')}>Go to create account</button></li>
                <li><button onClick={() => navigate('/settings')}>Go to settings</button></li>
            </ul>
        </Container>
    )
}