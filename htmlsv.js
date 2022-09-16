/* Copyright Daniel Rooke 18/08/2022 */
function htmlsvVersion(){
    return "v0.1"
}
function runscript(script){
    //sanitize the charater codes, replace with characters
    //console.log("sanitzing string:" + script)
    var tscript = "";
    var s2 = 0;
    for(var s = 0; s < script.length; s++){
        if(script[s] === '&'){
            //console.log("got ampersand" + script[s+2]);
            if(script[s+1] === 'l' && script[s+2] === 't'){
                //console.log("changing string")
                tscript += '<';
            }
            else if(script[s+1] === 'g' && script[s+2] === 't'){
                //console.log("changing string")
                tscript += '>';
            }
            //console.log(script[s] + script[s+1] + script[s+2] + script[s+3]);
            s+=3;
        }
        else{
            tscript += "" + script[s];
        }
    }
    //console.log("running:"+tscript)
    var rtrn = eval('(function() {'+tscript+'}())')
    //console.log("returned:" + rtrn);
    return rtrn;
}
function parseHTMLS(chunk){
    var lastcmd = [];
    var itrtype = 0;
    var runsrpt = "";
    var typsrpt = "";

    for(var c = 0; c < chunk.length; c++){
        if(chunk.charAt(c) === '\\' && itrtype != 1){
            //console.log(typsrpt);
            itrtype = 1;
        }
        else if(itrtype === 1){
            if(chunk.charAt(c) === '('){
                itrtype = 2;
                runsrpt = "";
            }
            else if(chunk.charAt(c) === '{'){
                itrtype = 3;
                runsrpt = "";
            }
            else if(chunk.charAt(c) === '}'){
                //console.log("runscript:"+runsrpt);
                typsrpt += "" + runscript(runsrpt);
                runsrpt = "";
                itrtype = 0;
            } 
            else if(chunk.charAt(c) === ')'){
                itrtype = 0;
                typsrpt += "" + runscript(runsrpt);
//                runscript(runsrpt);
                runsrpt = "";
            }
            else if(chunk.charAt(c) === '\\'){
                //console.log("\\");
                if(itrtype > 1){
                    runscript += '\\';
                }
                else{
                    typsrpt += '\\';
                }
            }
        }
        else if(itrtype === 0){
            typsrpt += "" + chunk.charAt(c);
        }
        else if(itrtype > 1){
            runsrpt += "" + chunk.charAt(c);
        }        
    }
    //console.log(typsrpt);
    return typsrpt;
}
