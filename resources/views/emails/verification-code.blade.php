<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de Vérification - AMAZIGHI SHOP</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .code-container {
            background-color: #f8f9fa;
            border: 2px dashed #007bff;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .verification-code {
            font-size: 36px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 8px;
            margin: 10px 0;
        }
        .code-label {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-icon {
            color: #856404;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
        }
        .info {
            background-color: #d1ecf1;
            border: 1px solid #b6d4d8;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .contact-info {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🛒 AMAZIGHI SHOP</div>
            <h2 style="color: #333; margin: 0;">
                @if($type === 'signup')
                    Vérification de votre inscription
                @else
                    Réinitialisation de votre mot de passe
                @endif
            </h2>
        </div>

        <div class="content">
            <p>Bonjour{{ $userName ? ' ' . $userName : '' }},</p>
            
            @if($type === 'signup')
                <p>Merci de vous être inscrit sur <strong>AMAZIGHI SHOP</strong> ! Pour finaliser votre inscription, veuillez utiliser le code de vérification ci-dessous :</p>
            @else
                <p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>AMAZIGHI SHOP</strong>. Utilisez le code de vérification ci-dessous pour continuer :</p>
            @endif

            <div class="code-container">
                <div class="code-label">Votre code de vérification :</div>
                <div class="verification-code">{{ $code }}</div>
                <div class="code-label">Valide pendant 15 minutes</div>
            </div>

            @if($type === 'signup')
                <div class="info">
                    <strong>📝 Comment utiliser ce code :</strong><br>
                    1. Revenez sur la page d'inscription<br>
                    2. Entrez ce code dans le champ prévu<br>
                    3. Cliquez sur "Vérifier" pour activer votre compte
                </div>
            @else
                <div class="info">
                    <strong>🔑 Comment utiliser ce code :</strong><br>
                    1. Revenez sur la page de réinitialisation<br>
                    2. Entrez ce code dans le champ prévu<br>
                    3. Définissez votre nouveau mot de passe
                </div>
            @endif

            <div class="warning">
                <span class="warning-icon">⚠️ Important :</span><br>
                • Ce code est valide pendant <strong>15 minutes uniquement</strong><br>
                • Ne partagez jamais ce code avec quelqu'un d'autre<br>
                • Si vous n'avez pas fait cette demande, ignorez cet email
            </div>

            <div class="contact-info">
                <strong>🤔 Besoin d'aide ?</strong><br>
                Si vous rencontrez des problèmes, n'hésitez pas à nous contacter :<br>
                📧 Email : <a href="mailto:amazighishoop@gmail.com">amazighishoop@gmail.com</a>
            </div>
        </div>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement par <strong>AMAZIGHI SHOP</strong></p>
            <p>© {{ date('Y') }} AMAZIGHI SHOP - Tous droits réservés</p>
            <p style="color: #adb5bd; font-size: 11px;">
                Si vous avez des problèmes pour voir cet email, contactez-nous directement.
            </p>
        </div>
    </div>
</body>
</html>