import { PromptConfig, Documents } from '../src/copilot/utils/types';

export interface TestCase {
    description: string;
    documents: Documents;
    promptConfig: PromptConfig;
}

export function getTestCases(config: any): TestCase[] {
    return [
        {
            description: "Basic addition and multiplication functions",
            documents: {
                main: {
                    content: `
                        function add(a, b) {
                            return a + b;
                        }
        
                        function multiply(a, b) {
                            return a * b;
                        }
        
                        // User is typing here
                    `,
                    cursorPosition: 201
                }
            },
            promptConfig: {
                requestType: 'inline',
                language: 'TypeScript',
            }
        },
        {
            description: "Incomplete function definition",
            documents: {
                main: {
                    content: `
                        function subtract(a, b) {
                            return 
                        }
        
                        // User is typing here
                    `,
                    cursorPosition: 110
                }
            },
            promptConfig: {
                requestType: 'inline',
                language: 'TypeScript',
            }
        },
        {
            description: "Nested function call",
            documents: {
                main: {
                    content: `
                        function square(a) {
                            return a * a;
                        }
        
                        function addSquares(x, y) {
                            return square(x) + 
                        }
        
                        // User is typing here
                    `,
                    cursorPosition: 210
                }
            },
            promptConfig: {
                requestType: 'inline',
                language: 'TypeScript',
            }
        },
        {
            description: "Complex code with comments and multiple data types",
            documents: {
                main: {
                    content: `
                        // Calculate the factorial of a number
                        function factorial(n) {
                            if (n === 0) {
                                return 1;
                            } else {
                                return n * factorial(n - 1);
                            }
                        }
        
                        // Calculate the power of a number
                        function power(base, exponent) {
                            let result = 1;
                            for (let i = 0; i < exponent; i++) {
                                result *= base;
                            }
                            return result;
                        }
        
                        // User is typing here
                    `,
                    cursorPosition: 400
                }
            },
            promptConfig: {
                requestType: 'inline',
                language: 'TypeScript',
            }
        },
        {
            description: "Concerto model definition",
            documents: {
                main: {
                    content: `
                    namespace org.example.mytemplate
        
                    import org.accordproject.contract.* from https://models.accordproject.org/accordproject/contract.cto
                    import org.accordproject.runtime.* from https://models.accordproject.org/accordproject/runtime.cto
                    
                    transaction MyRequest extends Request {
                      o String input
                    }
                    
                    transaction MyResponse extends Response {
                      o String output
                    }
                    
                    /**
                     * The model for the contract
                     */
                    asset MyContract extends Contract {
                      /**
                       * The name for the contract
                       */
                      o String name
                      
                    } 
                    
                    asset MyAsset {
                    `,
                    cursorPosition: 2100
                }
            },
            promptConfig: {
                requestType: 'inline',
                language: 'concerto',
            }
        },
        {
            description: "General advice request",
            documents: {
                main: {
                    content: `
                        write a function to divide two numbers
                    `,
                    cursorPosition: 136
                }
            },
            promptConfig: {
                requestType: 'general',
                instruction: 'Provide general advice for improving this code'
            }
        }
    ];
}

export function getUnitTestCase(config: any): TestCase {
    return {
        description: "Basic addition and multiplication functions",
        documents: {
            main: {
                content: `
                    function add(a, b) {
                        return a + b;
                    }

                    function multiply(a, b) {
                        return a * b;
                    }

                    // User is typing here
                `,
                cursorPosition: 201
            }
        },
        promptConfig: {
            requestType: 'inline',
            language: 'TypeScript',
        }
    };
}
