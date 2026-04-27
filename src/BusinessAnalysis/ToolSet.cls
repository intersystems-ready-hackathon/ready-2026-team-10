Class Sample.ToolSet Extends %AI.ToolSet [DependsOn=Sample.Tools]
{
    XData Definition
    {
        <ToolSet>
            <Description>Sample Toolset</Description>
            <Include Class="BusinessAnalysis.Tools"></Include>
            <MCP Name="PythonServer">
                <Stdio Executable="/usr/irissys/bin/irispython" 
                Args="/home/irisowner/dev/src/Python/multiplication_mcp.py" />
            </MCP>
        </ToolSet>
    }    
}

