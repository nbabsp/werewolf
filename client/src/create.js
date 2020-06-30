import hostMainP from './host/HostMain'
import guestMainP from './GuestMain'
import './Global.css'

if (process.env.ENV == 'debug') console.log('we are dubugging!')

hostMainP()
guestMainP()
