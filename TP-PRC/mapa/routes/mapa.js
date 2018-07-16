var express = require('express');
var router = express.Router();
 
const SparqlClient = require('sparql-client-2')
const SPARQL = SparqlClient.SPARQL
const endpoint = 'http://localhost:7200/repositories/TP-PRC'
const myupdateEndpoint = 'http://localhost:7200/repositories/TP-PRC/statements'
 
var client = new SparqlClient( endpoint, {updateEndpoint: myupdateEndpoint,
                               defaultParameters: {format: 'json'}})
 
client.register({rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                 din: 'http://www.semanticweb.org/jonas/ontologies/2018/5/dinastias#'})
 
/* GET home page. */
router.get('/', function(req, res, next) {
    var query = "select * where{\n" +
                "?d a din:Dinastia .\n" +
                "?d din:nome ?nome . \n" +
                "?d din:ordem ?ordem } \n" +
                "order by ?ordem"
 
    client.query(query)
            .execute()
            .then(function(qres){
                //console.log(JSON.stringify(qres))
                var resList = qres.results.bindings
                var dot = "digraph Dinastias {\n" +
                          'rankdir=LR;'
                          'PT [shape=box,label="Portugal"];\n' +
                          'dinastias [shape=diamond,label="Dinastias"];\n' +
                          'PT -> dinastias [color=blue];\n'
 
                for(var i in resList){
                    var dinastia = resList[i].d.value
                    var did = dinastia.slice(dinastia.indexOf('#')+1)
                    

                    var dnome = resList[i].nome.value
                    
                    var url = "http://localhost:3000/dinmapa/dinastias/" + did
                    
                    dot += 'd' + i + '[label="' + did + '",href="' + url + '"];\n'
                    dot += 'dinastias -> d' + i + ' [color=blue];\n'
                    dot += 'nomeD' + i + ' [shape=box,label="' + dnome + '"];\n'
                    dot += 'd'+i+' -> nomeD'+i+' [label="nome"];\n'
                }
                    dot += "}"      
                   
                res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })
})
//Get Dinastia
router.get('/dinastias/:did', (req, res, next)=>{
    
    var did = req.params.did
    
    var query = "select * where {\n" +
                "din:"+did+" din:nome ?nome .\n" +
                'OPTIONAL {\n' +
                'din:'+did+' din:dinastiaTemPessoa ?p .\n' +
                '?p a din:Monarca .\n' +
                '?p din:nome ?nomeP .\n' +
                '}\n' +
                "}"
 
    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            
            var dnome = resList[0].nome.value
            var dot = "digraph Dinastia {\n" +
                    'rankdir=LR;\n' +
                    'PT [label="Portugal",href="http://localhost:3000/dinmapa"];\n' +
                    'dinastias [shape=diamond,label="Dinastias"];\n' +
                    'monarcas [shape=diamond,label="Monarcas"];\n' +
                    'PT -> dinastias ;\n' +
                    '\"'+dnome+'\"[shape=box];\n'+
                    'dinastias -> \"' + dnome + '\";\n' +
                    '\"' + dnome + '\" -> monarcas ;\n'
   
            for(var i in resList){
                var monarca = resList[i].p.value
                var mon = monarca.slice(monarca.indexOf('#')+1)
                var url = "http://localhost:3000/dinmapa/monarca/" + mon
                var pnome = resList[i].nomeP.value

                dot += 'm' + i + '[label="' + mon + '",href="' + url + '"];\n'
                dot += 'monarcas -> m' + i + ';\n'
                dot += 'nomeM' + i + ' [shape=box,label="' + pnome + '"];\n'
                dot += 'm'+i+' -> nomeM'+i+' [label="nome"];\n'
            }
            dot += "}"      
            res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })    
})
 
router.get('/monarca/:id', (req, res, next)=>{
    var mid = req.params.id
    var query = "select * where{\n" +
                "din:" + mid + " din:nome ?nome .\n" +
                "din:" + mid + " din:dataNascimento ?dnasc .\n" +
                "din:" + mid + " din:dataMorte ?dmorte .\n" +
                'OPTIONAL {\n' +
                "din:" + mid + " din:cognome ?cognome .\n" +
                "din:" + mid + " din:casaReal ?casaReal .\n" +
                "din:" + mid + " din:inicioReinado ?iRein .\n" +
                "din:" + mid + " din:fimReinado ?fRein .\n" +
                '\n}'+
                'OPTIONAL {\n' +
                "din:" + mid + " din:coroacao ?dcor .\n" +
                '\n}'+
                'OPTIONAL {\n' +
                "din:" + mid + " din:aclamacao ?dacl .\n" +
                '\n}'+
                "din:" + mid + " din:pertenceADinastia ?d .\n" +
                'OPTIONAL {\n' +
                "din:" + mid + " din:eProgenitorDe ?f .\n" +
                '?f din:nome ?nomeF .\n' +
                '\n}'+
                "?d din:nome ?dnome }"
 
    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            console.log(resList)
            var dnome = resList[0].dnome.value
            var pnome = resList[0].nome.value
            var dnasc = resList[0].dnasc.value
            var dmorte = resList[0].dmorte.value
            

            if(resList[0].iRein != undefined) var iRein = resList[0].iRein.value
            if(resList[0].fRein != undefined) var fRein = resList[0].fRein.value
            if(resList[0].cognome != undefined) var cognome = resList[0].cognome.value
            if(resList[0].casaReal != undefined) var casaReal = resList[0].casaReal.value
            if(resList[0].dcor != undefined) var dcor = resList[0].dcor.value
            if(resList[0].dacl != undefined) var dacl = resList[0].dacl.value

            var dinastiaURI = resList[0].d.value
            var did = dinastiaURI.slice(dinastiaURI.indexOf('#')+1)
 
            var dot = "digraph Monarca {\n" +
                      'PT [label="Portugal",href="http://localhost:3000/dinmapa"];\n' +
                      'dinastias [shape=diamond,label="Dinastias"];\n' +
                      'monarcas [shape=diamond,label="Monarcas"];\n' +
                      'filhos [shape=diamond,label="Filhos"];\n' +
                      '\"' + dnome + '\" [href="http://localhost:3000/dinmapa/dinastias/' + did + '"];\n' +
                      'PT -> dinastias ;\n' +
                      'dinastias -> \"' + dnome + '";\n' +
                      '"'+ dnome + '" -> monarcas ;\n'+
                      'monarcas -> monarca ; \n' +
                      '\"'+pnome+'\"[shape=box];\n'+
                      '\"'+dnasc+'\"[shape=box];\n'+
                      '\"'+dmorte+'\"[shape=box];\n'+
                      'monarca -> "' + pnome + '" [label="nome"];\n' +
                      'monarca -> "' + dnasc + '" [label="data nascimento"];\n' +
                      'monarca -> "' + dmorte + '" [label="data morte"];\n' +
                      'monarca -> filhos ; \n'  
            if(iRein != undefined) dot += '\"'+iRein+'\"[shape=box];\n' + 
                                        'monarca -> "' + iRein + '" [label="Inicio do Reinado"];\n'
            if(fRein != undefined) dot += '\"'+fRein+'\"[shape=box];\n'+ 
                                        'monarca -> "' + fRein + '" [label="Fim do Reinado"];\n'
            if(cognome != undefined) dot += '\"'+cognome+'\"[shape=box];\n'+ 
                                        'monarca -> "' + cognome + '" [label="Cognomes"];\n'
            if(casaReal != undefined) dot += '\"'+casaReal+'\"[shape=box];\n'+ 
                                        'monarca -> "' + casaReal + '" [label="Casa Real"];\n'
            if(dcor != undefined) dot += '\"'+dcor+'\"[shape=box];\n'+ 
                                    'monarca -> "' + dcor + '" [label="Data Coroação"];\n'
            if(dacl != undefined) dot += '\"'+dacl+'\"[shape=box];\n'+ 
                                    'monarca -> "' + dacl + '" [label="Data Aclamação"];\n'
            for(var i in resList){
                if(resList[i].f == undefined) break
                var filho = resList[i].f.value
                var mon = filho.slice(filho.indexOf('#')+1)
                var fnome = resList[i].nomeF.value
                var url = "http://localhost:3000/dinmapa/filho/" + mon

                dot += 'f' + i + '[label="' + mon + '",href="' + url + '"];\n'
                dot += 'filhos -> f' + i + ';\n'
                dot += 'nomeM' + i + ' [shape=box,label="' + fnome + '"];\n'
                dot += 'f'+i+' -> nomeM'+i+' [label="nome"];\n'
            }
            dot += '}'
            //console.log('\n\nMapa:\n' + dot)
            res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
 })
 
//Get filho
router.get('/filho/:fid', (req, res, next)=>{
    
    var fid = req.params.fid
    
    var query = "select * where{\n" +
                "din:" + fid + " din:nome ?nome .\n" +
                "din:" + fid + " din:dataNascimento ?dnasc .\n" +
                "din:" + fid + " din:dataMorte ?dmorte .\n" +
                'OPTIONAL {\n' +
                "din:" + fid + " din:cognome ?cognome .\n" +
                "din:" + fid + " din:casaReal ?casaReal .\n" +
                "din:" + fid + " din:inicioReinado ?iRein .\n" +
                "din:" + fid + " din:fimReinado ?fRein .\n" +
                '\n}'+
                'OPTIONAL {\n' +
                "din:" + fid + " din:coroacao ?dcor .\n" +
                '\n}'+
                'OPTIONAL {\n' +
                "din:" + fid + " din:aclamacao ?dacl .\n" +
                '\n}'+
                "din:" + fid + " din:pertenceADinastia ?d .\n" +
                'OPTIONAL {\n' +
                "din:" + fid + " din:temPai ?pai .\n" +
                '?pai din:nome ?nomeP .\n' +
                '\n}'+
                'OPTIONAL {\n' +
                "din:" + fid + " din:eProgenitorDe ?f .\n" +
                '?f din:nome ?nomeF .\n' +
                '\n}'+
                "?d din:nome ?dnome }"
 
    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            console.log(resList)
            var dnome = resList[0].dnome.value
            var pnome = resList[0].nome.value
            var dnasc = resList[0].dnasc.value
            var dmorte = resList[0].dmorte.value
            

            if(resList[0].iRein != undefined) var iRein = resList[0].iRein.value
            if(resList[0].fRein != undefined) var fRein = resList[0].fRein.value
            if(resList[0].cognome != undefined) var cognome = resList[0].cognome.value
            if(resList[0].casaReal != undefined) var casaReal = resList[0].casaReal.value
            if(resList[0].dcor != undefined) var dcor = resList[0].dcor.value
            if(resList[0].dacl != undefined) var dacl = resList[0].dacl.value

            if(resList[0].pai != undefined){ var pId = resList[0].pai.value
                var paiId = pId.slice(pId.indexOf('#')+1)
            }
            if(resList[0].nomeP != undefined) var nomeP = resList[0].nomeP.value

            var dinastiaURI = resList[0].d.value
            var did = dinastiaURI.slice(dinastiaURI.indexOf('#')+1)
 
            var dot = "digraph Monarca {\n" +
                      'PT [label="Portugal",href="http://localhost:3000/dinmapa"];\n' +
                      'dinastias [shape=diamond,label="Dinastias"];\n' +
                      'nobres [shape=diamond,label="Nobres"];\n' +
                      'nobre [shape=diamond,label="Nobre"];\n' +
                      '\"' + dnome + '\" [href="http://localhost:3000/dinmapa/dinastias/' + did + '"];\n' +
                      'PT -> dinastias ;\n' +
                      'dinastias -> \"' + dnome + '";\n' +
                      '"'+ dnome + '" -> nobres ;\n'+
                      '\"'+pnome+'\"[shape=box];\n'+
                      '\"'+dnasc+'\"[shape=box];\n'+
                      '\"'+dmorte+'\"[shape=box];\n'+
                      'nobre -> "' + pnome + '" [label="nome"];\n' +
                      'nobre -> "' + dnasc + '" [label="data nascimento"];\n' +
                      'nobre -> "' + dmorte + '" [label="data morte"];\n' +
                      'filhos [shape=diamond,label="Filhos"];\n' +
                      'nobre -> filhos ; \n'  
            if(iRein != undefined) dot +='\"'+iRein+'\"[shape=box];\n'+ 
                                        'nobre -> "' + iRein + '" [label="Inicio do Reinado"];\n'
            if(fRein != undefined) dot += '\"'+fRein+'\"[shape=box];\n'+
                                        'nobre -> "' + fRein + '" [label="Fim do Reinado"];\n'
            if(cognome != undefined) dot += '\"'+cognome+'\"[shape=box];\n'+
                                        'nobre -> "' + cognome + '" [label="Cognomes"];\n'
            if(casaReal != undefined) dot += '\"'+casaReal+'\"[shape=box];\n'+
                                        'nobre -> "' + casaReal + '" [label="Casa Real"];\n'
            if(dcor != undefined) dot += '\"'+dcor+'\"[shape=box];\n'+ 
                                        'nobre -> "' + dcor + '" [label="Data Coroação"];\n'
            if(dacl != undefined) dot += '\"'+dacl+'\"[shape=box];\n'+ 
                                        'nobre -> "' + dacl + '" [label="Data Aclamação"];\n'
            if(nomeP != undefined){ 
                dot+= '\"' + nomeP + '\" [href="http://localhost:3000/dinmapa/filho/' + paiId + '"];\n' +
                      'pai [shape=diamond,label="Pai"];\n' +
                      'nobres -> pai ;\n' +
                      'pai -> \"'+nomeP+'\";\n'+
                      '\"'+nomeP+'\" -> nobre;\n'
            }
            else dot += 'nobres -> nobre ; \n'
            for(var i in resList){
                if(resList[i].f == undefined) break
                var filho = resList[i].f.value
                var mon = filho.slice(filho.indexOf('#')+1)
                var fnome = resList[i].nomeF.value
                var url = "http://localhost:3000/dinmapa/filho/" + mon

                dot += 'f' + i + '[label="' + mon + '",href="' + url + '"];\n'
                dot += 'filhos -> f' + i + ';\n'
                dot += 'nomeM' + i + ' [shape=box,label="' + fnome + '"];\n'
                dot += 'f'+i+' -> nomeM'+i+' [label="nome"];\n'
            }
            dot += '}'     
            res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })    
})



module.exports = router;