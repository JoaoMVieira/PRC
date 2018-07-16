<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:ex="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <rdf:RDF 
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
            xmlns:ex="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#"
            xml:base="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#">
            
            <rdf:Description rdf:ID="Curso">
                <rdf:type rdf:resource="rdfs:Class"/>
            </rdf:Description>

            <rdfs:Datatype rdf:about="http://www.w3.org/2001/XMLSchema#string"/>
            <rdf:Property rdf:ID="yearuc">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="nameuc">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="url">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="name">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="acr">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="year">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="students">
                <rdfs:domain rdf:resource="ex:Curso"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>

            <xsl:apply-templates select="courses/course"/>
            
            
        </rdf:RDF>
    </xsl:template>
    
    <xsl:template match="course">
        <ex:Curso rdf:ID="{generate-id()}">
            <ex:yearuc><xsl:value-of select="year"/></ex:yearuc>
            <ex:nameuc><xsl:value-of select="name"/></ex:nameuc>
            <ex:url><xsl:value-of select="url"/></ex:url> 
            <ex:name><xsl:value-of select="grad/name"/></ex:name>
            <ex:acr><xsl:value-of select="grad/acr"/></ex:acr>
            <ex:year><xsl:value-of select="grad/year"/></ex:year>
            <ex:students><xsl:value-of select="students"/></ex:students>
        </ex:Curso>
    </xsl:template>
    
</xsl:stylesheet>