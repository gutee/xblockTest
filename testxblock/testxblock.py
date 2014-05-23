"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment


class TestXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    correctAnswers = Integer(
        default=0, scope=Scope.user_state,
        help="Correct Answers in Current Video",
    )

    wrongAnswers = Integer(
        default=0, scope=Scope.user_state,
        help="Wrong Answers in Current Video",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the TestXBlock, shown to students
        when viewing courses.
        """
        #html = self.resource_string("static/html/testxblock.html")
        html = self.resource_string("static/html/index.html")
        frag = Fragment(html.format(self=self))
        #frag.add_css(self.resource_string("static/css/testxblock.css"))
        #frag.add_javascript(self.resource_string("static/js/src/testxblock.js"))
        #frag.initialize_js('TestXBlock')

        frag.add_css(self.resource_string("static/css/style.css"))
        frag.add_javascript(self.resource_string("static/js/src/jquery-1.11.0.js"))
        frag.add_javascript(self.resource_string("static/js/src/popcorn.js"))
        frag.add_javascript(self.resource_string("static/js/src/test.js"))

        frag.initialize_js('TestXBlock')

        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_wrong(self, data, suffix=''):
        """
        An example handler, which increments the wrong answers.
        """

        self.wrongAnswers += 1
        return {"wrongAnswers": self.wrongAnswers}

    @XBlock.json_handler
    def increment_correct(self, data, suffix=''):
        """
        An example handler, which increments the correct answers.
        """

        self.correctAnswers += 1
        return {"correctAnswers": self.correctAnswers}

    @XBlock.handler
    def video_finished(self, request, suffix=''):
        try:
            self.runtime.publish(self, 'grade', {
                'value': self.correctAnswers,
                'max_value': (self.wrongAnswers + self.correctAnswers),
            })
        except NotImplementedError:
            # Note, this publish method is unimplemented in Studio runtimes, so
            # we have to figure that we're running in Studio for now
            pass

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("TestXBlock",
             """<vertical_demo>
                <testxblock/>
                <testxblock/>
                <testxblock/>
                </vertical_demo>
             """),
        ]