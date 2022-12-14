// BASE
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

// COMPONENTS
import {App} from './app/containers/App';

AppRegistry.registerComponent(appName, () => App);
