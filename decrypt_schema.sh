gpg --quiet --batch --yes --decrypt --passphrase="$SCHEMA_PASSPHRASE" \
--output backend/db/init/00-database.sql backend/db/init/00-database.sql.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SCHEMA_PASSPHRASE" \
--output backend/db/init/01-functions-1.sql backend/db/init/01-functions-1.sql.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SCHEMA_PASSPHRASE" \
--output backend/db/init/02-functions-2.sql backend/db/init/02-functions-2.sql.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SCHEMA_PASSPHRASE" \
--output backend/db/init/03-policies.sql backend/db/init/03-policies.sql.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SCHEMA_PASSPHRASE" \
--output backend/db/init/04-instruments.sql backend/db/init/04-instruments.sql.gpg