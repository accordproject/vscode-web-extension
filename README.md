<h1 align="center">
  Accord Project Concerto Extension for VS Code
</h1>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=accordproject.concerto-vscode-extension"><img src="https://vsmarketplacebadge.apphb.com/version/accordproject.concerto-vscode-extension.svg" alt="Version number"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=accordproject.concerto-vscode-extension"><img src="https://vsmarketplacebadge.apphb.com/installs/accordproject.concerto-vscode-extension.svg" alt="Installation count"></a> <a href="https://github.com/accordproject/concerto-vscode-extension/blob/master/LICENSE"><img src="https://img.shields.io/github/license/accordproject/concerto-vscode-extension" alt="GitHub license"></a>
  <a href="https://discord.com/invite/Zm99SKhhtA">
    <img src="https://img.shields.io/badge/Accord%20Project-Join%20Discord-blue" alt="Join the Accord Project Discord" />
  </a>
</p>

The Accord Project Concerto extension helps developers to create, test and debug [Accord Project](https://accordproject.org) Concerto files.

For a step-by-step guide on getting started with the extension's features, access our [VS Code Tutorial](https://docs.accordproject.org/docs/next/tutorial-vscode.html). For more comprehensive documentation, [follow this link.](https://docs.accordproject.org)

![Accord Project Extension Homepage](assets/VSCodeImage.png)

## Installation

Please visit the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accordproject.concerto-vscode-extension) for installation and more details.

## Usage on the Web

This is a [Web Extension](https://code.visualstudio.com/api/extension-guides/web-extensions) and can be used by VS Code when running within your web-browser. For example, by visiting the URL: https://github.com/accordproject/models/blob/main/src/finance/loan%400.3.0.cto

> Note that other VS Code web hosting options are available.

## Features

- Create data models using the [Concerto](https://docs.accordproject.org/docs/model-concerto.html) modelling language
- Compilation of Concerto files to other languages
- Syntax highlighting for all files
- Compilation and problem markers

### Commands

- Compile your ``model.cto `` file to a target

![Code Gen GIF](./assets/Code%20Gen.gif)

- Work offline by downloading Concerto model dependencies (context-click on a `*.cto` file)

### Concerto Snippets

The extention adds code snippets for the following elements of the Concerto language.

| Element     |   Prefix    |
| :---------- | :---------: |
| Asset       |    asset    |
| Participant | participant |
| Transaction | transaction |
| Concept     |   concept   |
| Enum        |    enum     |
| Scalar      |    scalar   |
| Event       |    event    |
| Namespace   |   namespace |
| Import      |    import   |
| String      |    string   |
| Double      |    double   |
| Integer     |    int      |
| Long        |    long     |
| DateTime    |    date     |
| Boolean     |    bool     |

## Contact Us
If you have find any problems or want to make suggestions for future features please create [issues and suggestions on Github](https://github.com/accordproject/concerto-vscode-extension/issues). For any questions please [join](https://discord.com/invite/Zm99SKhhtA) the Accord Project Discord community and post questions to the `#technology-concerto` channel.

---

<p align="center">
  <a href="https://www.accordproject.org/">
    <img src="assets/APLogo.png" alt="Accord Project Logo" width="400" />
  </a>
</p>

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/accordproject/cicero?color=bright-green" alt="GitHub license">
  </a>
  <a href="https://accord-project-slack-signup.herokuapp.com/">
    <img src="https://img.shields.io/badge/Accord%20Project-Join%20Slack-blue" alt="Join the Accord Project Slack"/>
  </a>
</p>

Accord Project is an open source, non-profit, initiative working to transform contract management and contract automation by digitizing contracts. Accord Project operates under the umbrella of the [Linux Foundation][linuxfound]. The technical charter for the Accord Project can be found [here][charter].

## Learn More About Accord Project

### [Overview][apmain]

### [Documentation][apdoc]

## Contributing

The Accord Project technology is being developed as open source. All the software packages are being actively maintained on GitHub and we encourage organizations and individuals to contribute requirements, documentation, issues, new templates, and code.

Find out what’s coming on our [blog][apblog].

Join the Accord Project Technology Working Group [Discord channel][apdiscord] to get involved!

For code contributions, read our [CONTRIBUTING guide][contributing] and information for [DEVELOPERS][developers].

### README Badge

Using Accord Project? Add a README badge to let everyone know: [![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)

```
[![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)
```

## License <a name="license"></a>

Accord Project source code files are made available under the [Apache License, Version 2.0][apache].
Accord Project documentation files are made available under the [Creative Commons Attribution 4.0 International License][creativecommons] (CC-BY-4.0).

Copyright 2018-2019 Clause, Inc. All trademarks are the property of their respective owners. See [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/).

[linuxfound]: https://www.linuxfoundation.org
[charter]: https://github.com/accordproject/governance/blob/master/accord-project-technical-charter.md
[apmain]: https://accordproject.org/ 
[apblog]: https://medium.com/@accordhq
[apdoc]: https://docs.accordproject.org/
[apdiscord]: https://discord.com/invite/Zm99SKhhtA

[contributing]: https://github.com/accordproject/vscode-web-extension/blob/master/CONTRIBUTING.md
[developers]: https://github.com/accordproject/vscode-web-extension/blob/master/DEVELOPERS.md

[apache]: https://github.com/accordproject/vscode-web-extension/blob/master/LICENSE
[creativecommons]: http://creativecommons.org/licenses/by/4.0/