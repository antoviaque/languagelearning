
# Imports ###########################################################

import coverage

from django.test.simple import build_suite, build_test, reorder_suite
from django.conf import settings
from django.test.simple import DjangoTestSuiteRunner
from django.test.testcases import TestCase
from django.utils import unittest
from django.db.models import get_app, get_apps


# Classes ###########################################################

class SelectiveTestSuiteRunner(DjangoTestSuiteRunner):
    def build_suite(self, test_labels, extra_tests=None, **kwargs):
        suite = unittest.TestSuite()

        if test_labels:
            for label in test_labels:
                if '.' in label:
                    suite.addTest(build_test(label))
                else:
                    app = get_app(label)
                    suite.addTest(build_suite(app))
        else:
            for app in get_apps():
                pkg = app.__name__.split('.')[:-1]
                pkg = '.'.join(pkg)
                excluded_apps = getattr(settings, u'TEST_EXCLUDED_APPS', [])
                if pkg not in excluded_apps:
                    suite.addTest(build_suite(app))

        if extra_tests:
            for test in extra_tests:
                suite.addTest(test)

        return reorder_suite(suite, (TestCase,))


class SelectiveTestSuiteRunnerWithCoverage(SelectiveTestSuiteRunner):
    """
    Test runner which displays a code coverage report at the end of the
    run.  It will not display coverage if:

    a) The COVERAGE_MODULES setting is not set.
    b) A specific app is being tested.
    """
    def run_tests(self, test_labels, extra_tests=None, **kwargs):
        self.enable_coverage = hasattr(settings, u'COVERAGE_MODULES')

        if self.enable_coverage:
            coverage.use_cache(0)
            coverage.start()
     
        super(SelectiveTestSuiteRunnerWithCoverage, self)\
                            .run_tests(test_labels, extra_tests=None, **kwargs)
    
    def suite_result(self, suite, result, **kwargs):
        if self.enable_coverage:
            coverage.stop()
     
            print u'-------------------------------------------------'
            print u'Coverage'
            print u'-------------------------------------------------'
     
            # Report coverage
            coverage_modules = []
            for module in settings.COVERAGE_MODULES:
                coverage_modules.append(__import__(module, globals(), locals(), ['']))
     
            coverage.report(coverage_modules, show_missing=1)
     
            print '-------------------------------------------------'
     
        return super(SelectiveTestSuiteRunnerWithCoverage, self)\
                        .suite_result(suite, result, **kwargs)

