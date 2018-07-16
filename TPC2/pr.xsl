<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output encoding="UTF-8" indent="yes" method="xhtml"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8"/>
            </head>
            <body>
                <h1>Project Record</h1>
                <xsl:apply-templates />
            </body>
        </html>
    </xsl:template>
    
    <xsl:template match="pr">
        
            <xsl:apply-templates/>
        
    </xsl:template>
    
    <xsl:template match="meta">
        <table width="100%">
            <tr>
                <td width="33%" valign="top">
                    <div><xsl:value-of select="./id"/></div>
                    <xsl:value-of select="./supervisor"/>
                </td>
                <td width="33%" valign="middle">
                    <div align="center"><b><xsl:value-of select="./title"/></b></div>
                    <div align="center"><b><xsl:value-of select="./subtitle"/></b></div>
                </td>
                <td width="33%" valign="top">
                    <div align="right"><xsl:value-of select="bdate"/></div>
                    <div align="right"><xsl:value-of select="edate"/></div>
                </td>
            </tr>
        </table>
    </xsl:template>
    
    
    <!--   Team   -->
    
    <xsl:template match="team">
        <hr/>
        <h3>Team</h3>
        <xsl:apply-templates/><br/>
    </xsl:template>
    
    <xsl:template match="student">
        <ul>
            <xsl:apply-templates/>
        </ul>
    </xsl:template>
    
    <xsl:template match="name|nr">
        <li>
            <xsl:value-of select="."/>
        </li>
    </xsl:template>
    
    <xsl:template match="email">
        <li>
            <a href="mailto:{.}"><xsl:value-of select="."/></a>
        </li>
    </xsl:template>
    
    <!--   Abstract   -->
    
    <xsl:template match="abstract">
        <br/>
        <hr/>
        <h3>Abstract</h3>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="p">
        <p><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="b">
        <b><xsl:apply-templates/></b>
    </xsl:template>
    
    <xsl:template match="i">
        <i><xsl:apply-templates/></i>
    </xsl:template>
    
    <xsl:template match="img">
        <img src="{@src}"/>
    </xsl:template>
    
    <xsl:template match="iref">
        <a href="#{@url}"><xsl:apply-templates/></a>
    </xsl:template>
    
    <xsl:template match="xref">
        <a href="{@url}"><xsl:apply-templates/></a>
    </xsl:template>
    
    <xsl:template match="code">
        <pre>
            <code>
                <xsl:apply-templates/>
            </code>
        </pre>
    </xsl:template>
    
    <!--   Deliverables   -->
    
    <xsl:template match="deliverables">
        <br/>
        <hr/>
        <h3>Deliverables</h3>
        <ul>
            <xsl:apply-templates/>
        </ul>
    </xsl:template>
       
    <xsl:template match="deliverable">
        <li>
            <a href="{@url}"><xsl:value-of select="."/></a>
        </li>
    </xsl:template>
       
</xsl:stylesheet>