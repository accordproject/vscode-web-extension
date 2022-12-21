<h1 align="center">
  Accord Project Concerto Extension for VS Code
</h1>

<p align="center">
  <a href="https://discord.com/invite/Zm99SKhhtA">
    <img src="https://img.shields.io/badge/Accord%20Project-Join%20Discord-blue" alt="Join the Accord Project Discord" />
  </a>
</p>

The Accord Project Concerto extension helps developers to create, test and debug [Accord Project](https://accordproject.org) Concerto files.

For a step-by-step guide on getting started with the extension's features, access our [VS Code Extension documentation](https://concerto.accordproject.org/docs/vscode). For more comprehensive Concerto documentation, [follow this link.](https://concerto.accordproject.org)

![Accord Project Extension Homepage](assets/VSCodeImage.png)

## Contributing

We love Open Source contributions; whether they be [fixes to the documentation](https://github.com/accordproject/concerto-docs), or [bug reports, feature requests, or code contrbutions](https://github.com/accordproject/vscode-web-extension) to the extension itself.

Financial contributions are also very welcome and can be made to Accord Project, via the [Linux Foundation Crowdfunding portal](https://crowdfunding.lfx.linuxfoundation.org/projects/accordproject).

## Installation

Please visit the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accordproject.concerto-vscode-extension) for installation and more details.

## Usage on the Web

This is a [Web Extension](https://code.visualstudio.com/api/extension-guides/web-extensions) and can be used by VS Code when running within your web-browser. For example, by visiting the URL: https://github.com/accordproject/models/blob/main/src/finance/loan%400.3.0.cto

> Note that other VS Code web hosting options are available.

## Features

- Create data models using the [Concerto](https://concerto.accordproject.org) modeling language
- Compilation of Concerto files to other languages
- Syntax highlighting for all files
- Compilation and problem markers

### Commands

- Compile your ``model.cto `` file to a target language

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

For any questions please [join](https://discord.com/invite/Zm99SKhhtA) the Accord Project Discord community and post questions to the `#technology-concerto` channel.

---

Accord Project is an open source, non-profit, initiative working to transform contract management and contract automation by digitizing contracts. Accord Project operates under the umbrella of the [Linux Foundation][linuxfound]. The technical charter for the Accord Project can be found [here][charter].

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