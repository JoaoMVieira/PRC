<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="text" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <xsl:for-each select="//distrito>
            <xsl:text>### http://prc2018.di.uminho.pt/mapa#Dvct</xsl:text>
            <xsl:call-template name="linha"/>
            <xsl:text>:Dvct rdf:type owl:NamedIndividual</xsl:text>
            <xsl:call-template name="linha"/>
            <xsl:text>:Distrito</xsl:text>
            <xsl:call-template name="linha"/>
            <xsl:text>:nome</xsl:text>
            <xsl:call-template select="designação"/>
            <xsl:call-template name="linha"/>
            <xsl:call-template name="linha"/>
        </xsl:for-each>
        
    </xsl:template>
    
</xsl:stylesheet>