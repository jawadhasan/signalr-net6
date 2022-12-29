

# reactjs client

ReactJS client

## Description

A simple ReactJS enabled client.

https://signalrchat.awsclouddemos.com/

### Installing

Install dependencies
```
npm ci
```

Run development server
```
npm run dev
```

Build Project

```
npm run build
```

Deploy to S3 (dist folder)

```
aws s3 sync . s3://signalrchat.awsclouddemos.com --acl public-read
```




## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. [@jawadhasan](https://twitter.com/jawadhasan)  
ex. [Blog](https://hexquote.com/aboutme/)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [MIT] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [part1](https://hexquote.com/building-and-deploying-a-signalr-chat-application-part-1/)
* [part2](https://hexquote.com/building-and-deploying-a-signalr-chat-application-part-2/)
* [part3](https://hexquote.com/building-and-deploying-a-signalr-chat-application-part-3/)