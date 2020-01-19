const fs = require( 'fs' );

let code = null;
let keywords = [];
let cursor = 0;
let tokens = [];

fs.readFile( 'wonky1.nancarrow', 'utf8', ( err, data ) => {
    if ( err ) {
        throw err;
    }

    code = data;

    lex();
    parse();
} );



function lex() {
    lines = code.split( "\n" );

    let i;
    for ( i in lines ) {
        let line = lines[i].split( /[\s]+/ );
        
        let w = 0;
        for ( w in line ) {
            let word = line[w];
                
            let type = 'variable';

            if ( ! word.trim() ) {
                continue; // skip whitespace
            }

            if ( isNote( word ) ) {
                type = 'note';
                
                // remove commas
                word = word.replace( ',', '' );
            }


            // tokens we include for englishness
            if ( isDecorative( word ) ) {
                type = 'decorative';
            }

            if ( isHumanisor( word ) ) {
                type = 'humanisor';
            }

            if ( isPlay( word ) ) {
                type = 'play';
            }

            if ( isInstrumentOn( word ) ) {
                type = 'instrumenton';
            }

            if ( isInstrument( word ) ) {
                type = 'instrument';
            }

            if ( isVariableAssignation( word ) ) {
                type = 'assign';
            }

            tokens.push( {
                'type': type,
                'value': word
            } );
        }

        tokens.push ( {
            'type': 'newline',
            'value': null
        })
    }
}

function isNote( token ) {
    return token.match( /[A-G]/ );
}

function isDecorative( token ) {
    return token.match( /the/ );
}

function isHumanisor( token ) {
    return token.match( /badly|competently|perfectly/ );
}

function isInstrument( token ) {
    return token.match( /piano|flute/ );
}

function isPlay( token ) {
    return token.match( /play/ );
}

function isInstrumentOn( token ) {
    return token.match( /on/ );
}

function isVariableAssignation( token ) {
    return token.match( /goes/ );
}


function parse() {
    let i = 0;
    let assigning = false;
    let assigning_to = null;
    let variables = [];


    for( i in tokens ) {
        let next = tokens[i/1+1];
        let current = tokens[i];

        if ( assigning && current.type == 'note' ) {
            if ( ! variables[assigning_to] ) {
                variables[assigning_to] = [];
            }

            variables[assigning_to].push( current.value );

        }

        if ( current.type == 'variable' ) {
            if ( next.type == 'assign' ) {
                assigning_to = current.value;
                continue; // we're assigning -- currently the only thing we can do
            }
            if ( next.type == 'on' ) {
                continue; // ignore for now
            }
        } 

        if ( current.type == 'assign' ) {
            assigning = true;
        }

        if ( current.type == 'newline' ) {
            assigning = assigning_to = false;
        }

        if ( current.type == 'play' ) {
            if ( next.type == 'variable' ) {
                console.log( 'playing', next.value );
            } else {
                throw "unknown";
            }
        }
    } 

    console.log( variables );
}
