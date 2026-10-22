## Purpose

Allow users to capture and export the daily decision as a high-resolution PNG image for offline sharing and printing.

## Requirements

### Requirement: Captura e Exportação da Decisão em PNG

The system SHALL capture the decision display container and generate a downloadable PNG image using high-density resolution scaling.

#### Scenario: Gerar imagem PNG de alta qualidade com sucesso

- **GIVEN** O usuário está na página de decisão que deseja capturar
- **WHEN** O usuário clica no botão "Salvar PNG"
- **THEN** A biblioteca html2canvas é acionada com escala 1.5
- **THEN** Um arquivo de imagem PNG de alta resolução é gerado
- **THEN** O download automático é iniciado com o nome padrão decisao-recife-YYYY-MM-DD.png (ISO 8601)

### Requirement: Tratamento de Falhas na Exportação

The system SHALL handle export failures gracefully displaying an informative message to the user.

#### Scenario: Falha na geração da imagem capturada

- **GIVEN** Ocorre uma falha ou restrição na renderização do canvas
- **WHEN** O usuário clica no botão "Salvar PNG"
- **THEN** A aplicação captura a exceção e exibe a mensagem "Não foi possível gerar imagem. Tente novamente."
- **THEN** Nenhum download corrompido é iniciado
