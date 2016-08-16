# Gestion de l'authentification

## Différentes étapes

Étape 1: Se connecter au thing en SSH. </br>
Étape 2: Installer AWS CLI sur le thing. </br>
Étape 3: Se connecter à AWS. </br>
Étape 4: Générer les certificats. </br>

## Réalisation

Une fois connecté au thing, il vous faudra installer Python package manager:
```
curl https://bootstrap.pypa.io/ez_setup.py -o - | python
easy_install pip
```

Il vous faudra ensuite installer AWS CLI:
```
pip install awscli
```

Il vous faudra ensuite vous connecter à AWS:
Vous devrez préalablement créer un nouvel utilisateur sur AWS (pour les credentials).
```
aws configure
```

Créez un répertoire pour stocker les clés:
```
mkdir certificats
cd certificats
```

Créez une clé privée avec openssl (remplissez les champs comme il se doit):
```
openssl genrsa -out privateKey.pem 2048
openssl req -new -key privateKey.pem -out cert.csr
```

Activez le certificat:
```
aws iot create-certificate-from-csr --certificate-signing-request file://cert.csr --set-as-active > certOutput.txt
```

Enregistrez le certificat dans un fichier .pem:
```
aws iot describe-certificate --certificate-id <certificate ID> --output text --query certificateDescription.certificatePem  > cert.pem
```

Créez un fichier policy.doc et collez-y le code Json ci-dessous:
```
{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Action":["iot:*"],
"Resource": ["*"]
}]
}
```

Créez la police sur AWS IoT:
```
aws iot create-policy --policy-name PubSubToAnyTopic --policy-document file://policy.doc
```

Attachez la police au certificat (remplacez <principal arn> par l'arn dans certOutput.txt):
```
aws iot attach-principal-policy --principal <principal arn> --policy-name "PubSubToAnyTopic"
```

Téléchargez le certificat pour communiquer avec AWS en MQTT:
```
curl https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem > rootCA.pem
```
