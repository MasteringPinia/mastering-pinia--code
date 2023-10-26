import { LogMessageTypeEnum, showMessage } from './logging'
import { $settings } from './settings'

// Welcome message
if (
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  $settings &&
  !$settings.hideWelcomeMessage &&
  $settings.showTips
) {
  showMessage(
    LogMessageTypeEnum.tip,
    { label: '👋 Welcome!', title: `Let's get you started with the Exercise Platform, click here 👇`, endGroup: false },
    'Tips like this one should help you unblock your way through exercises.',
    '**Only unveil them after being blocked for at least a few minutes!**',
    'You can **completely** disable tips by executing the following snippet in the console:',
    '```js',
    `hardMode()`,
    '```',
    'You can turn them back again with $settings.showTips = true',
    'Hide the whole welcome message with:',
    '```js',
    `$settings.hideWelcomeMessage = true`,
    '```',
  )

  showMessage(
    LogMessageTypeEnum.info,
    { collapsed: true, title: 'This is an info message' },
    'This message contains useful information about the exercise',
    'Try not to miss info messages',
    'These messages appear expanded by default',
  )
  showMessage(
    LogMessageTypeEnum.warn,
    { collapsed: true, title: 'This is an warning message' },
    'It means that something unexpected was found in your code or that there is something you should pay attention to',
    'You should always read warnings',
    'These messages appear expanded by default',
  )
  showMessage(
    LogMessageTypeEnum.error,
    { collapsed: true, title: 'This is an error message' },
    'Something unexpected happened, you might need to reach out to your instructor for help',
    'Pay extra attention to error messages',
    'These messages appear expanded by default',
  )
  showMessage(
    LogMessageTypeEnum.tip,
    { collapsed: true, title: 'This is a tip message' },
    'Tips should help you unblock your way through exercises. They show the name of the test that is failing.',
    '**Only unveil them after being blocked for at least a few minutes! ** ',
  )

  showMessage(
    LogMessageTypeEnum.info,
    { title: 'Hide the whole welcome message with:' },
    '`$settings.hideWelcomeMessage = true`',
  )

  console.groupEnd()
}

if (typeof window !== 'undefined') {
  window.$settings = $settings
  window.hardMode = function hardMode() {
    if (!$settings!.showTips) {
      showMessage(
        'info',
        {
          label: '👀',
          labelStyle: 'background: #f6e05e;',
          color: 'black',
          bgColor: '#f6e05e',
          title: 'Struggling on the hard mode, are we?',
        },
        `You are already on Hard Mode, so I imagine you wanted to turn tips back on instead.`,
        `Simply type in`,
        '```js',
        `$settings.showTips = true`,
        '```',
        `and voila!`,
        `Don't worry, we won't tell anyone you needed a little help 🤫`,
      )
      return
    }
    showMessage(
      'tip',
      {
        label: '💀',
        labelStyle: 'background: crimson;',
        title: 'Hard mode activated!',
      },
      `You are a brave one, aren't you?`,
    )
    $settings!.showTips = false
  }
  // hardMode()
}
