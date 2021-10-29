import difflib
import os


class TestConfig:
    FOLDER = 'services/nginx'
    DEV = os.path.join(FOLDER, 'dev_default.conf')
    PROD = os.path.join(FOLDER, 'default.conf')

    def test_configs_mostly_match(self) -> None:
        with open(self.DEV) as dev:
            with open(self.PROD) as prod:
                diff = [
                    i
                    for i in difflib.ndiff(dev.readlines(), prod.readlines())
                    if i.startswith('-') or i.startswith('+')
                ]

                # 12 lines are all that's needed for the diff between dev and prod
                assert len(diff) == 12, "More than 12 lines are different between nginx configs"
