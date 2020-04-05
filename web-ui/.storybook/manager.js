import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import 'bootstrap/dist/css/bootstrap.min.css';

addons.setConfig({
  theme: themes.dark,
});