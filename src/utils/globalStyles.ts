import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0
    }
    #root, body{
        height: 100%;
        width: 100%;
        margin: 0
    }    
`;

export default GlobalStyles;
