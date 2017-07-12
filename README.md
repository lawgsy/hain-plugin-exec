# hain-plugin-exec

A plugin to execute arbitrary commands for [Hain](https://github.com/appetizermonster/hain), with optional parameters.

![Screenshot](hain-plugin-exec.png?raw=true)

# Note

Commands are not processed for possible dangers, use at your own risk. This is just as dangerous, or safe, as skilled you are at terminal/cmd prompt.

The timeout is hardcoded and set to 5 seconds. This is a global timeout, intermediate output (for example, pinging until stopped) will not reset it and these commands will be killed after the timeout is reached.

# Install

Open Hain and type

```
/hpm install hain-plugin-exec
```

# Usage

```
/exec command [parameters]
```

# Examples

```
/exec dir --help
/exec ping google.com
/exec ping google.com -t
/exec ls -lt
```

# Final warning

I have only tested this on Windows. I have no idea what would happen if you tried to, for example, open a VI window. I have tested it on Windows, just for fun:

```
Vim: Warning: Output is not to a terminal
Vim: Warning: Output is not to a terminal
7[?47h[27m[24m[0m[H[J[2;1H[1m[34m~
(gibberish, gibberish)
(execution interrupted - 5 second timeout reached)
child process exited with code null
```

# Credit

Plugin by Lawgsy ([lawgsy@gmail.com](mailto:lawgsy@gmail.com)).
