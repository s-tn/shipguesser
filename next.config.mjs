/** @type {import('next').NextConfig} */

import { withExpo } from '@expo/next-adapter'
import { withPlugins } from 'next-compose-plugins'
import * as ntm from 'next-transpile-modules'

const withTM = ntm([
  'solito'
])

export default withPlugins([withTM, [withExpo, { projectRoot: __dirname }]], {

})